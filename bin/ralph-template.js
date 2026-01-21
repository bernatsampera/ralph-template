#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || 'ralph-project';
const templateDir = path.join(__dirname, '..', 'template');

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory "${targetDir}" already exists.`);
  process.exit(1);
}

try {
  fs.cpSync(templateDir, targetDir, { recursive: true });

  console.log(`\nCreated ${targetDir}/\n`);
  console.log('Next steps:');
  console.log(`  cd ${targetDir}`);
  console.log('  # Edit specs/ and fix_plan.md manually, or describe your project');
  console.log('  # and let Claude set them up for you (see BLUEPRINT.md)');
  console.log('  npm start\n');
} catch (err) {
  console.error('Error creating project:', err.message);
  process.exit(1);
}
