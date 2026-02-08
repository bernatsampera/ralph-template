const {
  color,
  getCurrent,
  hasUnsavedChanges,
  matchesTemplate,
  formatDate,
  getMetadata,
} = require('./utils');

function main() {
  const current = getCurrent();
  const unsaved = hasUnsavedChanges();

  console.log('');

  if (!current.name) {
    // No version loaded
    if (matchesTemplate()) {
      console.log(color('Current state:', 'bright'), 'Blank template');
      console.log(color('Status:', 'dim'), 'Clean (matches template)');
    } else {
      console.log(color('Current state:', 'bright'), 'Unsaved configuration');
      console.log(color('Status:', 'dim'), color('Modified', 'yellow'), '(not saved)');
      console.log('');
      console.log('To save this configuration:');
      console.log('  npm run ralph:save -- <name>');
    }
  } else {
    // A version is loaded
    const metadata = getMetadata();
    const info = metadata.versions[current.name];

    console.log(color('Current configuration:', 'bright'), color(current.name, 'green'));
    console.log(color('Loaded at:', 'dim'), formatDate(current.loaded_at));

    if (info) {
      console.log(color('Last saved:', 'dim'), formatDate(info.updated_at));
    }

    if (unsaved) {
      console.log(color('Status:', 'dim'), color('Modified', 'yellow'), '(has unsaved changes)');
      console.log('');
      console.log('To save changes:');
      console.log(`  npm run ralph:save -- ${current.name}`);
    } else {
      console.log(color('Status:', 'dim'), color('Clean', 'green'), '(no changes since load)');
    }
  }

  console.log('');
}

main();
