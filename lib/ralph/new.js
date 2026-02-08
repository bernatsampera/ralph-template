const fs = require('fs');
const {
  TEMPLATE_PATH,
  color,
  setCurrent,
  hasUnsavedChanges,
  matchesTemplate,
  promptUser,
  saveCurrentFirst,
  copyVersionedContent,
  clearVersionedContent,
} = require('./utils');

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

  // Clear existing versioned content and copy from template
  clearVersionedContent();
  const { filesCopied, dirsCopied } = copyVersionedContent(TEMPLATE_PATH, process.cwd());

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
