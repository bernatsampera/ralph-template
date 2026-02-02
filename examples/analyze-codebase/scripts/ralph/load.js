const fs = require('fs');
const path = require('path');
const {
  VERSIONED_FILES,
  VERSIONED_DIRS,
  color,
  getCurrent,
  setCurrent,
  hasUnsavedChanges,
  promptUser,
  copyDir,
  removeDir,
  getVersionPath,
  versionExists,
  listVersions,
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
  const args = process.argv.slice(2);
  const name = args[0];

  // Check for name argument
  if (!name) {
    console.error(color('Error:', 'red'), 'Please provide a configuration name to load.');
    console.log('\nUsage: npm run ralph:load -- <name>');

    const versions = listVersions();
    if (versions.length > 0) {
      console.log('\nAvailable configurations:');
      versions.forEach((v) => console.log(`  - ${v}`));
    }
    process.exit(1);
  }

  // Check if version exists
  if (!versionExists(name)) {
    console.error(color('Error:', 'red'), `Configuration '${name}' not found.`);

    const versions = listVersions();
    if (versions.length > 0) {
      console.log('\nAvailable configurations:');
      versions.forEach((v) => console.log(`  - ${v}`));
    } else {
      console.log('\nNo configurations saved yet. Save one first:');
      console.log('  npm run ralph:save -- <name>');
    }
    process.exit(1);
  }

  // Check for unsaved changes
  const current = getCurrent();
  if (hasUnsavedChanges()) {
    console.log(color('Warning:', 'yellow'), 'Current state has unsaved changes.');
    const answer = await promptUser('Save current state first? (y/n/cancel): ');

    if (answer === 'cancel' || answer === 'c') {
      console.log('Load cancelled.');
      process.exit(0);
    }

    if (answer === 'y' || answer === 'yes') {
      const saved = await saveCurrentFirst();
      if (!saved) {
        console.log('Load cancelled.');
        process.exit(0);
      }
    }
  }

  const versionPath = getVersionPath(name);

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

  // Copy from saved version
  let filesCopied = 0;
  for (const file of VERSIONED_FILES) {
    const srcPath = path.join(versionPath, file);
    const destPath = path.join(process.cwd(), file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      filesCopied++;
    }
  }

  let dirsCopied = 0;
  for (const dir of VERSIONED_DIRS) {
    const srcPath = path.join(versionPath, dir);
    const destPath = path.join(process.cwd(), dir);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
      dirsCopied++;
    }
  }

  // Update current
  setCurrent(name);

  console.log(color('Loaded!', 'green'), `Configuration '${name}' has been loaded.`);
  console.log(`  Files: ${filesCopied}, Directories: ${dirsCopied}`);
}

main().catch((err) => {
  console.error(color('Error:', 'red'), err.message);
  process.exit(1);
});
