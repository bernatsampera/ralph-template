/**
 * Validates structured task format in ralph.md
 *
 * Required format:
 *   - [ ] **Task title**
 *     - Read: `file1.js`, `file2.js`
 *     - Do: Description
 *     - Output: What to produce
 *     - Done when: Acceptance criteria
 */

function validateTasks(content) {
  const errors = [];
  const warnings = [];

  // Split into tasks by finding unchecked checkbox lines with bold titles
  const lines = content.split('\n');
  const tasks = [];
  let currentTask = null;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip HTML comments
    if (line.includes('<!--')) inComment = true;
    if (inComment) {
      if (line.includes('-->')) inComment = false;
      continue;
    }
    const uncheckedMatch = line.match(/^- \[ \] \*\*(.+?)\*\*/);
    const checkedMatch = line.match(/^- \[x\] \*\*(.+?)\*\*/);

    if (uncheckedMatch || checkedMatch) {
      if (currentTask) {
        tasks.push(currentTask);
      }
      currentTask = {
        title: (uncheckedMatch || checkedMatch)[1],
        completed: !!checkedMatch,
        lineNumber: i + 1,
        fields: { read: false, do: false, output: false, doneWhen: false }
      };
    } else if (currentTask) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- Read:')) currentTask.fields.read = true;
      if (trimmed.startsWith('- Do:')) currentTask.fields.do = true;
      if (trimmed.startsWith('- Output:')) currentTask.fields.output = true;
      if (trimmed.startsWith('- Done when:')) currentTask.fields.doneWhen = true;

      // A non-indented line that isn't a sub-field ends the task
      if (line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && !line.startsWith('-')) {
        tasks.push(currentTask);
        currentTask = null;
      }
    }
  }

  if (currentTask) {
    tasks.push(currentTask);
  }

  // Validate each unchecked task has required fields
  const requiredFields = ['do', 'doneWhen'];
  const recommendedFields = ['read', 'output'];

  for (const task of tasks) {
    if (task.completed) continue;

    for (const field of requiredFields) {
      if (!task.fields[field]) {
        const fieldName = field === 'doneWhen' ? 'Done when' : field.charAt(0).toUpperCase() + field.slice(1);
        errors.push(`Task "${task.title}" (line ${task.lineNumber}): missing required field "${fieldName}"`);
      }
    }

    for (const field of recommendedFields) {
      if (!task.fields[field]) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        warnings.push(`Task "${task.title}" (line ${task.lineNumber}): missing recommended field "${fieldName}"`);
      }
    }
  }

  return {
    taskCount: tasks.length,
    completedCount: tasks.filter(t => t.completed).length,
    tasks,
    errors,
    warnings
  };
}

module.exports = { validateTasks };
