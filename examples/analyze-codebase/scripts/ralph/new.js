const fs = require('fs');
const path = require('path');
const {
  TEMPLATE_PATH,
  VERSIONED_FILES,
  VERSIONED_DIRS,
  color,
  setCurrent,
  hasUnsavedChanges,
  matchesTemplate,
  promptUser,
  copyDir,
  removeDir,
} = require('./utils');

async function saveCurrentFirst() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter name to save current configuration: ', async (name) => {
      rl.close();
      if (name.trim()) {
        // Run save script
        const { execSync } = require('child_process');
        try {
          execSync(`node ${path.join(__dirname, 'save.js')} "${name.trim()}"`, {
            stdio: 'inherit',
          });
          resolve(true);
        } catch (err) {
          resolve(false);
        }
      } else {
        console.log('Save cancelled.');
        resolve(false);
      }
    });
  });
}

async function main() {
  // Check if template exists
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(
      color('Error:', 'red'),
      `Template not found at ${TEMPLATE_PATH}`
    );
    console.log('Please verify the ralph installation.');
    process.exit(1);
  }

  // Check if already at template state
  if (matchesTemplate()) {
    console.log(color('Info:', 'cyan'), 'Current state is already a blank template.');
    process.exit(0);
  }

  // Check for unsaved changes
  if (hasUnsavedChanges()) {
    console.log(color('Warning:', 'yellow'), 'Current state has unsaved changes.');
    const answer = await promptUser('Save current state first? (y/n/cancel): ');

    if (answer === 'cancel' || answer === 'c') {
      console.log('Reset cancelled.');
      process.exit(0);
    }

    if (answer === 'y' || answer === 'yes') {
      const saved = await saveCurrentFirst();
      if (!saved) {
        console.log('Reset cancelled.');
        process.exit(0);
      }
    }
  }

  // Clear existing versioned files
  for (const file of VERSIONED_FILES) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Clear existing versioned directories
  for (const dir of VERSIONED_DIRS) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      removeDir(dirPath);
    }
  }

  // Copy from template
  let filesCopied = 0;
  for (const file of VERSIONED_FILES) {
    const srcPath = path.join(TEMPLATE_PATH, file);
    const destPath = path.join(process.cwd(), file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      filesCopied++;
    }
  }

  let dirsCopied = 0;
  for (const dir of VERSIONED_DIRS) {
    const srcPath = path.join(TEMPLATE_PATH, dir);
    const destPath = path.join(process.cwd(), dir);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
      dirsCopied++;
    }
  }

  // Clear current (no version loaded)
  setCurrent(null);

  console.log(color('Reset!', 'green'), 'Configuration reset to blank template.');
  console.log(`  Files: ${filesCopied}, Directories: ${dirsCopied}`);
  console.log('');
  console.log('You can now customize AGENT.md, fix_plan.md, and specs/ for your new task.');
}

main().catch((err) => {
  console.error(color('Error:', 'red'), err.message);
  process.exit(1);
});
