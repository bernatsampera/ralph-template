const {
  RALPH_DIR,
  color,
  getMetadata,
  getCurrent,
  formatDate,
} = require('./utils');
const fs = require('fs');
const path = require('path');

function main() {
  const ralphDir = path.join(process.cwd(), RALPH_DIR);

  if (!fs.existsSync(ralphDir)) {
    console.log(color('No configurations saved yet.', 'yellow'));
    console.log('\nTo save the current configuration:');
    console.log('  npm run ralph:save -- <name>');
    return;
  }

  const metadata = getMetadata();
  const versions = Object.keys(metadata.versions);

  if (versions.length === 0) {
    console.log(color('No configurations saved yet.', 'yellow'));
    console.log('\nTo save the current configuration:');
    console.log('  npm run ralph:save -- <name>');
    return;
  }

  const current = getCurrent();

  console.log(color('\nSaved Ralph Configurations:', 'bright'));
  console.log('');

  for (const name of versions.sort()) {
    const info = metadata.versions[name];
    const isActive = current.name === name;
    const marker = isActive ? color('*', 'green') : ' ';
    const nameDisplay = isActive ? color(name, 'green') : name;
    const activeLabel = isActive ? color(' (active)', 'dim') : '';

    console.log(`  ${marker} ${nameDisplay}${activeLabel}`);
    console.log(`    ${color('Created:', 'dim')} ${formatDate(info.created_at)}`);
    console.log(`    ${color('Updated:', 'dim')} ${formatDate(info.updated_at)}`);

    const features = [];
    if (info.has_input) features.push('input');
    if (info.has_output) features.push('output');
    if (features.length > 0) {
      console.log(`    ${color('Includes:', 'dim')} ${features.join(', ')}`);
    }
    console.log('');
  }

  console.log(`${color('Total:', 'dim')} ${versions.length} configuration(s)`);
}

main();
