const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// Configuration
const RALPH_DIR = '.ralph-versions';
const CURRENT_FILE = '.ralph-current';
// Template path: from lib/ralph/ go up to repo root, then into template/
const TEMPLATE_PATH = path.resolve(__dirname, '..', '..', 'template');

// Files/folders that get versioned (task-specific)
const VERSIONED_FILES = ['AGENT.md', 'fix_plan.md'];
const VERSIONED_DIRS = ['specs', 'input', 'output'];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function color(text, colorName) {
  return `${colors[colorName]}${text}${colors.reset}`;
}

function ensureRalphDir() {
  const dir = path.join(process.cwd(), RALPH_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getMetadataPath() {
  return path.join(process.cwd(), RALPH_DIR, 'metadata.json');
}

function getMetadata() {
  const metadataPath = getMetadataPath();
  if (!fs.existsSync(metadataPath)) {
    return { versions: {}, schema_version: 1 };
  }
  return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
}

function saveMetadata(data) {
  ensureRalphDir();
  fs.writeFileSync(getMetadataPath(), JSON.stringify(data, null, 2));
}

function getCurrentPath() {
  return path.join(process.cwd(), CURRENT_FILE);
}

function getCurrent() {
  const currentPath = getCurrentPath();
  if (!fs.existsSync(currentPath)) {
    return { name: null, loaded_at: null };
  }
  return JSON.parse(fs.readFileSync(currentPath, 'utf8'));
}

function setCurrent(name) {
  const data = {
    name: name,
    loaded_at: name ? new Date().toISOString() : null,
  };
  fs.writeFileSync(getCurrentPath(), JSON.stringify(data, null, 2));
}

function validateName(name) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name cannot be empty' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return {
      valid: false,
      error: 'Name can only contain letters, numbers, hyphens, and underscores',
    };
  }
  return { valid: true };
}

function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return false;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeDir(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
  fs.rmdirSync(dir);
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getDirHash(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return null;
  }
  const hashes = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      hashes.push(`${entry.name}:${getDirHash(fullPath)}`);
    } else {
      hashes.push(`${entry.name}:${getFileHash(fullPath)}`);
    }
  }
  return crypto.createHash('md5').update(hashes.join('|')).digest('hex');
}

function hasUnsavedChanges() {
  const current = getCurrent();

  if (!current.name) {
    // No version loaded - check if current state differs from template
    return !matchesTemplate();
  }

  const savedPath = path.join(process.cwd(), RALPH_DIR, current.name);
  if (!fs.existsSync(savedPath)) {
    // Saved version doesn't exist anymore
    return true;
  }

  // Compare versioned files
  for (const file of VERSIONED_FILES) {
    const currentHash = getFileHash(path.join(process.cwd(), file));
    const savedHash = getFileHash(path.join(savedPath, file));
    if (currentHash !== savedHash) {
      return true;
    }
  }

  // Compare versioned directories
  for (const dir of VERSIONED_DIRS) {
    const currentHash = getDirHash(path.join(process.cwd(), dir));
    const savedHash = getDirHash(path.join(savedPath, dir));
    if (currentHash !== savedHash) {
      return true;
    }
  }

  return false;
}

function matchesTemplate() {
  // Check if current state matches the template
  for (const file of VERSIONED_FILES) {
    const currentHash = getFileHash(path.join(process.cwd(), file));
    const templateHash = getFileHash(path.join(TEMPLATE_PATH, file));
    if (currentHash !== templateHash) {
      return false;
    }
  }

  for (const dir of VERSIONED_DIRS) {
    const currentHash = getDirHash(path.join(process.cwd(), dir));
    const templateHash = getDirHash(path.join(TEMPLATE_PATH, dir));
    if (currentHash !== templateHash) {
      return false;
    }
  }

  return true;
}

function getVersionPath(name) {
  return path.join(process.cwd(), RALPH_DIR, name);
}

function versionExists(name) {
  return fs.existsSync(getVersionPath(name));
}

function listVersions() {
  const metadata = getMetadata();
  return Object.keys(metadata.versions);
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

async function saveCurrentFirst() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter name to save current configuration: ', async (name) => {
      rl.close();
      if (name.trim()) {
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

function copyVersionedContent(srcBase, destBase) {
  let filesCopied = 0;
  let dirsCopied = 0;

  for (const file of VERSIONED_FILES) {
    const srcPath = path.join(srcBase, file);
    const destPath = path.join(destBase, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      filesCopied++;
    }
  }

  for (const dir of VERSIONED_DIRS) {
    const srcPath = path.join(srcBase, dir);
    const destPath = path.join(destBase, dir);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
      dirsCopied++;
    }
  }

  return { filesCopied, dirsCopied };
}

function clearVersionedContent() {
  for (const file of VERSIONED_FILES) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  for (const dir of VERSIONED_DIRS) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      removeDir(dirPath);
    }
  }
}

module.exports = {
  RALPH_DIR,
  CURRENT_FILE,
  TEMPLATE_PATH,
  VERSIONED_FILES,
  VERSIONED_DIRS,
  colors,
  color,
  ensureRalphDir,
  getMetadata,
  saveMetadata,
  getCurrent,
  setCurrent,
  validateName,
  promptUser,
  copyDir,
  removeDir,
  getFileHash,
  getDirHash,
  hasUnsavedChanges,
  matchesTemplate,
  getVersionPath,
  versionExists,
  listVersions,
  formatDate,
  saveCurrentFirst,
  copyVersionedContent,
  clearVersionedContent,
};
