const fs = require('fs');
const path = require('path');
const {
  RALPH_DIR,
  color,
  ensureRalphDir,
  getMetadata,
  saveMetadata,
  setCurrent,
  validateName,
  promptUser,
  getVersionPath,
  versionExists,
  copyVersionedContent,
} = require('./utils');

async function main() {
  const args = process.argv.slice(2);
  const name = args[0];

  // Check for name argument
  if (!name) {
    console.error(color('Error:', 'red'), 'Please provide a configuration name.');
    console.log('\nUsage: npm run ralph:save -- <name>');
    console.log('Example: npm run ralph:save -- my-task');
    process.exit(1);
  }

  // Validate name
  const validation = validateName(name);
  if (!validation.valid) {
    console.error(color('Error:', 'red'), validation.error);
    process.exit(1);
  }

  // Check if version already exists
  if (versionExists(name)) {
    const answer = await promptUser(
      `Configuration '${name}' already exists. Overwrite? (y/n): `
    );
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Save cancelled.');
      process.exit(0);
    }
  }

  // Create version directory
  ensureRalphDir();
  const versionPath = getVersionPath(name);
  fs.mkdirSync(versionPath, { recursive: true });

  // Copy versioned content
  const { filesCopied, dirsCopied } = copyVersionedContent(process.cwd(), versionPath);

  // Create config.json for this version
  const configPath = path.join(versionPath, 'config.json');
  const now = new Date().toISOString();
  const config = {
    created_at: fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, 'utf8')).created_at
      : now,
    updated_at: now,
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Update metadata.json
  const metadata = getMetadata();
  metadata.versions[name] = {
    created_at: config.created_at,
    updated_at: config.updated_at,
    has_input: fs.existsSync(path.join(versionPath, 'input')),
    has_output: fs.existsSync(path.join(versionPath, 'output')),
  };
  saveMetadata(metadata);

  // Update current
  setCurrent(name);

  console.log(color('Saved!', 'green'), `Configuration '${name}' has been saved.`);
  console.log(`  Files: ${filesCopied}, Directories: ${dirsCopied}`);
  console.log(`  Location: ${versionPath}`);
}

main().catch((err) => {
  console.error(color('Error:', 'red'), err.message);
  process.exit(1);
});
