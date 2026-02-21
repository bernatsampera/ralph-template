#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const args = process.argv.slice(2);
const recipesDir = path.join(__dirname, '..', 'recipes');
const templateDir = path.join(__dirname, '..', 'template');

// --- Flags ---

if (args.includes('--version') || args.includes('-v')) {
  console.log(`ralph-template v${version}`);
  process.exit(0);
}

if (args.includes('--list-recipes')) {
  listRecipes();
  process.exit(0);
}

// --- Parse args ---

const recipeIdx = args.indexOf('--recipe');
const recipeName = recipeIdx !== -1 ? args[recipeIdx + 1] : null;

// First positional arg (not a flag or flag value)
const flagValues = new Set();
if (recipeIdx !== -1) flagValues.add(recipeIdx + 1);
const targetDir = args.find((a, i) => !a.startsWith('--') && !flagValues.has(i)) || 'ralph-project';

// --- Validate recipe before scaffolding ---

let recipePath = null;
let recipe = null;

if (recipeName) {
  recipePath = path.join(recipesDir, recipeName);
  const recipeFile = path.join(recipePath, 'recipe.json');

  if (!fs.existsSync(recipeFile)) {
    console.error(`Recipe "${recipeName}" not found.`);
    console.error('Run ralph-template --list-recipes to see available recipes.');
    process.exit(1);
  }

  recipe = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));
}

// --- Scaffold ---

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory "${targetDir}" already exists.`);
  process.exit(1);
}

try {
  fs.cpSync(templateDir, targetDir, { recursive: true });
  console.log(`\nCreated ${targetDir}/`);
} catch (err) {
  console.error('Error creating project:', err.message);
  process.exit(1);
}

// --- Recipe ---

if (recipe) {
  // Copy recipe specs
  const recipeSpecsDir = path.join(recipePath, 'specs');
  if (fs.existsSync(recipeSpecsDir)) {
    const specsTarget = path.join(targetDir, 'specs');
    fs.cpSync(recipeSpecsDir, specsTarget, { recursive: true });
    const specFiles = fs.readdirSync(recipeSpecsDir).filter(f => f !== '.gitkeep');
    console.log(`Copied ${specFiles.length} spec file(s) to ${targetDir}/specs/`);
  }

  // Copy custom AGENT.md if recipe provides one
  const recipeAgent = path.join(recipePath, 'AGENT.md');
  if (fs.existsSync(recipeAgent)) {
    fs.copyFileSync(recipeAgent, path.join(targetDir, 'AGENT.md'));
    console.log('Applied recipe AGENT.md');
  }

  // Inject recipe instructions into README.md
  const instructionsFile = path.join(recipePath, 'instructions.md');
  if (fs.existsSync(instructionsFile)) {
    const instructions = fs.readFileSync(instructionsFile, 'utf8');
    const readmePath = path.join(targetDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');

    const startMarker = '<!-- RECIPE_INSTRUCTIONS_START -->';
    const endMarker = '<!-- RECIPE_INSTRUCTIONS_END -->';

    const startIdx = readme.indexOf(startMarker);
    const endIdx = readme.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1) {
      readme = readme.substring(0, startIdx + startMarker.length) +
        '\n' + instructions.trim() + '\n' +
        readme.substring(endIdx);
      fs.writeFileSync(readmePath, readme);
      console.log('Injected recipe instructions into README.md');
    }
  }

  console.log('');
  console.log('Next steps:');
  console.log('  Tell your AI:');
  console.log(`    Read ${targetDir}/README.md and create a plan. Do NOT execute any tasks.`);
  console.log(`  Then: cd ${targetDir} && npm start 20\n`);
} else {
  // No recipe — standard output
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${targetDir}`);
  console.log('  # Edit specs/ and fix_plan.md manually, or describe your project');
  console.log('  # and let Claude set them up for you (see README.md)');
  console.log('  npm start\n');
}

// --- Helpers ---

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
