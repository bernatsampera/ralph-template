const {
  color,
  getCurrent,
  setCurrent,
  hasUnsavedChanges,
  promptUser,
  getVersionPath,
  versionExists,
  listVersions,
  saveCurrentFirst,
  copyVersionedContent,
  clearVersionedContent,
} = require('./utils');

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

  // Clear existing versioned content and copy from saved version
  clearVersionedContent();
  const { filesCopied, dirsCopied } = copyVersionedContent(versionPath, process.cwd());

  // Update current
  setCurrent(name);

  console.log(color('Loaded!', 'green'), `Configuration '${name}' has been loaded.`);
  console.log(`  Files: ${filesCopied}, Directories: ${dirsCopied}`);
}

main().catch((err) => {
  console.error(color('Error:', 'red'), err.message);
  process.exit(1);
});
