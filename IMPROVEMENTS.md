# Ralph Template - Improvements Analysis

This document outlines potential improvements for the Ralph autonomous agent framework, categorized by priority with actionable recommendations and code examples.

---

## Executive Summary

Ralph is a well-designed framework that solves a critical problem: context pollution in long-running AI workflows. The core architecture is sound, but there are several areas that need attention to improve reliability, maintainability, and developer experience.

**Key Findings:**
- 4 critical issues that could cause failures in production
- No test coverage
- Code duplication across configuration scripts
- Security concerns in shell script execution
- Missing documentation for common workflows

---

## Critical Improvements (Must Fix)

### 1. Hardcoded Absolute Path

**Location:** `template/scripts/ralph/utils.js:9`

**Current Code:**
```javascript
const TEMPLATE_PATH = '/Users/bsampera/Documents/projects/ralph/template';
```

**Problem:** This hardcoded path will break on any other machine or deployment.

**Fix:**
```javascript
// Option 1: Resolve relative to module location
const TEMPLATE_PATH = path.resolve(__dirname, '..', '..');

// Option 2: Use environment variable with fallback
const TEMPLATE_PATH = process.env.RALPH_TEMPLATE_PATH ||
  path.resolve(__dirname, '..', '..');
```

---

### 3. Code Duplication

**Problem:** The same patterns are repeated across `save.js`, `load.js`, and `new.js`:

1. **Unsaved changes check + prompt** (appears 3 times)
2. **Readline interface setup** (appears 3 times)
3. **File/directory copy loops** (appears 3 times)

**Example of Duplication (load.js:18-45 and new.js:16-43):**
```javascript
// This exact pattern appears in both files
async function saveCurrentFirst() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter name to save current configuration: ', async (name) => {
      // ... same implementation
    });
  });
}
```

**Fix - Extract to utils.js:**
```javascript
// utils.js - Add these functions
async function promptToSaveFirst() {
  const answer = await promptUser('Save current state first? (y/n/cancel): ');

  if (answer === 'cancel' || answer === 'c') {
    return { action: 'cancel' };
  }

  if (answer === 'y' || answer === 'yes') {
    const name = await promptUser('Enter name to save current configuration: ');
    if (name) {
      return { action: 'save', name };
    }
  }

  return { action: 'skip' };
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
```

---

