#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { version } = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

const recipesDir = path.join(__dirname, '..', 'recipes');
const libDir = path.join(__dirname, '..', 'lib');

// --- Flags ---

if (args.includes('--version') || args.includes('-v')) {
  console.log(`ralphmd v${version}`);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h') || !command) {
  printHelp();
  process.exit(0);
}

// --- Commands ---

switch (command) {
  case 'init':
    cmdInit(args.slice(1));
    break;
  case 'plan':
    cmdPlan(args.slice(1));
    break;
  case 'run':
    cmdRun(args.slice(1));
    break;
  case 'validate':
    cmdValidate();
    break;
  case 'list-recipes':
    listRecipes();
    break;
  default:
    // If it's not a known command, treat it as an inline goal for `plan`
    cmdPlan(args);
    break;
}

// ============================================================
// Commands
// ============================================================

function cmdInit(args) {
  const recipeIdx = args.indexOf('--recipe');
  const recipeName = recipeIdx !== -1 ? args[recipeIdx + 1] : null;

  const ralphFile = path.join(process.cwd(), 'ralph.md');

  if (fs.existsSync(ralphFile)) {
    console.error('Error: ralph.md already exists in this directory.');
    process.exit(1);
  }

  // Load template
  const templatePath = path.join(libDir, 'ralph-template.md');
  let content = fs.readFileSync(templatePath, 'utf8');

  // Apply recipe if specified
  if (recipeName) {
    const recipePath = path.join(recipesDir, recipeName);
    const recipeFile = path.join(recipePath, 'recipe.json');

    if (!fs.existsSync(recipeFile)) {
      console.error(`Recipe "${recipeName}" not found.`);
      console.error('Run: ralphmd list-recipes');
      process.exit(1);
    }

    const recipe = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));

    // Inject recipe instructions
    const instructionsFile = path.join(recipePath, 'instructions.md');
    if (fs.existsSync(instructionsFile)) {
      const instructions = fs.readFileSync(instructionsFile, 'utf8');
      content = content.replace(
        '<!-- RECIPE_CONTEXT -->',
        `## Recipe: ${recipe.name}\n\n${instructions.trim()}`
      );
    }

    // Inline recipe spec content into ralph.md's Reference section
    const recipeSpecsDir = path.join(recipePath, 'specs');
    if (fs.existsSync(recipeSpecsDir)) {
      const specFiles = fs.readdirSync(recipeSpecsDir).filter(f => f !== '.gitkeep' && f.endsWith('.md'));
      if (specFiles.length > 0) {
        const specContents = specFiles.map(f => {
          return fs.readFileSync(path.join(recipeSpecsDir, f), 'utf8').trim();
        }).join('\n\n---\n\n');
        content = content.replace(
          '<!-- RECIPE_REFERENCE -->',
          `## Reference\n\n${specContents}`
        );
      }
    }
  }

  // Clean up unused placeholders
  content = content.replace('<!-- RECIPE_CONTEXT -->\n\n', '');
  content = content.replace('\n<!-- RECIPE_REFERENCE -->\n', '\n');

  fs.writeFileSync(ralphFile, content);
  console.log('Created ralph.md');
  console.log('');

  if (recipeName) {
    console.log('Next: ralphmd plan');
  } else {
    console.log('Next: ralphmd plan "your goal here"');
  }
}

function cmdPlan(args) {
  const ralphFile = path.join(process.cwd(), 'ralph.md');

  // Collect the goal from remaining args (skip flags)
  const goal = args.filter(a => !a.startsWith('--')).join(' ');

  if (!fs.existsSync(ralphFile)) {
    // Auto-init if ralph.md doesn't exist and a goal is provided
    if (goal) {
      const templatePath = path.join(libDir, 'ralph-template.md');
      let content = fs.readFileSync(templatePath, 'utf8');
      content = content.replace('<!-- RECIPE_CONTEXT -->\n\n', '');
      fs.writeFileSync(ralphFile, content);
      console.log('Created ralph.md');
    } else {
      console.error('No ralph.md found. Run: ralphmd init');
      process.exit(1);
    }
  }

  // Build the planning prompt
  const planPromptPath = path.join(libDir, 'prompt-plan.md');
  let planPrompt = fs.readFileSync(planPromptPath, 'utf8');

  if (goal) {
    planPrompt = planPrompt.replace('{{GOAL}}', goal);
  } else {
    planPrompt = planPrompt.replace(
      'The user\'s goal is: {{GOAL}}',
      'Read ralph.md for the recipe instructions or goal context.'
    );
  }

  console.log('');
  console.log('Starting Ralph planning mode...');
  console.log('The AI will analyze your project and populate ralph.md with tasks.');
  console.log('It can ONLY read your codebase and write to ralph.md — no execution.');
  console.log('');

  // Launch claude in restricted mode:
  // - Only Read, Glob, Grep, Write tools (no Bash, no Edit)
  // - This structurally prevents the AI from executing anything
  const claudeArgs = [
    '-p', planPrompt,
    '--allowedTools', 'Read,Glob,Grep,Write',
    '--dangerously-skip-permissions',
    '--print',
    '--output-format', 'stream-json',
    '--verbose'
  ];

  const child = spawn('claude', claudeArgs, {
    stdio: ['inherit', 'pipe', 'inherit'],
    cwd: process.cwd()
  });

  // Pipe through parser
  const parser = spawn('bash', [path.join(libDir, 'parse_claude_output.sh')], {
    stdio: ['pipe', 'inherit', 'inherit']
  });

  child.stdout.pipe(parser.stdin);

  child.on('close', (code) => {
    parser.stdin.end();
    console.log('');
    console.log('Planning complete. Review ralph.md, then run: ralphmd run');
  });
}

function cmdRun(args) {
  const ralphFile = path.join(process.cwd(), 'ralph.md');

  if (!fs.existsSync(ralphFile)) {
    console.error('No ralph.md found. Run: ralphmd init');
    process.exit(1);
  }

  // Validate task format before running
  const { validateTasks } = require(path.join(libDir, 'validate-tasks.js'));
  const content = fs.readFileSync(ralphFile, 'utf8');
  const validation = validateTasks(content);

  if (validation.errors.length > 0) {
    console.error('Task validation errors in ralph.md:');
    validation.errors.forEach(e => console.error(`  - ${e}`));
    console.error('');
    console.error('Fix these issues or run: ralphmd validate');
    process.exit(1);
  }

  if (validation.taskCount === 0) {
    console.error('No tasks found in ralph.md. Run: ralphmd plan "your goal"');
    process.exit(1);
  }

  const pendingCount = validation.taskCount - validation.completedCount;
  if (pendingCount === 0) {
    console.log('All tasks in ralph.md are already complete!');
    process.exit(0);
  }

  // Parse max iterations
  const maxIdx = args.indexOf('--max');
  const maxIterations = maxIdx !== -1 ? parseInt(args[maxIdx + 1], 10) : pendingCount + 2;

  console.log(`Found ${validation.taskCount} tasks (${pendingCount} pending)`);

  // Delegate to the run loop
  const runLoop = spawn('bash', [
    path.join(libDir, 'run-loop.sh'),
    String(maxIterations)
  ], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, RALPH_LIB_DIR: libDir }
  });

  runLoop.on('close', (code) => {
    process.exit(code || 0);
  });
}

function cmdValidate() {
  const ralphFile = path.join(process.cwd(), 'ralph.md');

  if (!fs.existsSync(ralphFile)) {
    console.error('No ralph.md found.');
    process.exit(1);
  }

  const { validateTasks } = require(path.join(libDir, 'validate-tasks.js'));
  const content = fs.readFileSync(ralphFile, 'utf8');
  const validation = validateTasks(content);

  if (validation.taskCount === 0) {
    console.log('No tasks found in ralph.md.');
    process.exit(1);
  }

  console.log(`Tasks: ${validation.taskCount} total, ${validation.completedCount} completed`);
  console.log('');

  if (validation.warnings.length > 0) {
    console.log('Warnings:');
    validation.warnings.forEach(w => console.log(`  ⚠ ${w}`));
    console.log('');
  }

  if (validation.errors.length > 0) {
    console.log('Errors:');
    validation.errors.forEach(e => console.log(`  ✗ ${e}`));
    process.exit(1);
  } else {
    console.log('All tasks are well-formed.');
  }
}

// ============================================================
// Helpers
// ============================================================

function listRecipes() {
  if (!fs.existsSync(recipesDir)) {
    console.log('No recipes found.');
    return;
  }

  const entries = fs.readdirSync(recipesDir, { withFileTypes: true });
  let found = false;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const recipeFile = path.join(recipesDir, entry.name, 'recipe.json');
    if (!fs.existsSync(recipeFile)) continue;
    const recipe = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));
    console.log(`  ${entry.name} — ${recipe.description || '(no description)'}`);
    found = true;
  }

  if (!found) {
    console.log('No recipes found.');
  }
}

function printHelp() {
  console.log(`
ralphmd v${version} — AI agent loop

Usage:
  ralphmd init [--recipe <name>]     Create ralph.md in the current directory
  ralphmd plan "<goal>"              AI analyzes your project and creates tasks (planning only)
  ralphmd run [--max <n>]            Execute tasks from ralph.md one at a time
  ralphmd validate                   Check task format in ralph.md
  ralphmd list-recipes               Show available recipes

Examples:
  ralphmd init
  ralphmd plan "Refactor auth into separate modules"
  ralphmd run
  ralphmd run --max 20
  ralphmd init --recipe llms-txt && ralphmd plan

Workflow:
  1. ralphmd init                    Drop ralph.md into your project
  2. ralphmd plan "your goal"        AI creates structured tasks (can only read + write ralph.md)
  3. ralphmd run                     AI executes tasks one at a time with full access
`);
}
