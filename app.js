/**
 * Task Counter App
 * Stores tasks in localStorage so data persists across page reloads.
 */

const STORAGE_KEY = 'taskCounter_tasks';

/** @type {Array<{id: string, name: string, target: number, count: number}>} */
let tasks = [];

// ─── DOM references ───────────────────────────────────────────────────────────
const form = document.getElementById('add-task-form');
const taskNameInput = document.getElementById('task-name');
const taskTargetInput = document.getElementById('task-target');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');
const clearAllBtn = document.getElementById('clear-all-btn');

// ─── Persistence ──────────────────────────────────────────────────────────────
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ─── Helpers (clamp, generateId, escapeHtml live in utils.js) ─────────────────

// ─── Rendering ────────────────────────────────────────────────────────────────
function renderTasks() {
  // Remove all task cards (keep #empty-state node)
  Array.from(tasksList.querySelectorAll('.task-card')).forEach((el) => el.remove());

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    clearAllBtn.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  const hasCompleted = tasks.some((t) => t.count >= t.target);
  clearAllBtn.style.display = hasCompleted ? 'inline-block' : 'none';

  tasks.forEach((task) => {
    const card = createTaskCard(task);
    tasksList.appendChild(card);
  });
}

function createTaskCard(task) {
  const isCompleted = task.count >= task.target;
  const percent = clamp(Math.round((task.count / task.target) * 100), 0, 100);

  const card = document.createElement('div');
  card.className = 'task-card' + (isCompleted ? ' completed' : '');
  card.dataset.id = task.id;
  card.setAttribute('role', 'listitem');

  card.innerHTML = `
    <div class="task-info">
      <div class="task-name">
        ${escapeHtml(task.name)}
        ${isCompleted ? '<span class="badge-done">✓ Done</span>' : ''}
      </div>
      <div class="task-progress-bar-wrap" title="${percent}% complete">
        <div class="task-progress-bar" style="width: ${percent}%"></div>
      </div>
    </div>
    <div class="task-counter" aria-label="${task.count} of ${task.target} completions">
      ${task.count}<span class="task-counter-label">/ ${task.target}</span>
    </div>
    <div class="task-actions">
      <button
        class="btn-increment"
        aria-label="Increment ${escapeHtml(task.name)}"
        ${isCompleted ? 'disabled' : ''}
        title="${isCompleted ? 'Target reached!' : 'Mark as done once more'}"
      >+1</button>
      <button class="btn-delete" aria-label="Delete ${escapeHtml(task.name)}" title="Delete task">🗑</button>
    </div>
  `;

  card.querySelector('.btn-increment').addEventListener('click', () => incrementTask(task.id));
  card.querySelector('.btn-delete').addEventListener('click', () => deleteTask(task.id));

  return card;
}

// ─── Actions ──────────────────────────────────────────────────────────────────
function addTask(name, target) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const safeTarget = clamp(parseInt(target, 10) || 10, 1, 9999);

  tasks.push({
    id: generateId(),
    name: trimmed,
    target: safeTarget,
    count: 0,
  });
  saveTasks();
  renderTasks();
}

function incrementTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task || task.count >= task.target) return;
  task.count += 1;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((t) => t.count < t.target);
  saveTasks();
  renderTasks();
}

// ─── Event listeners ──────────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskNameInput.value, taskTargetInput.value);
  taskNameInput.value = '';
  taskTargetInput.value = '10';
  taskNameInput.focus();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Remove all completed tasks?')) {
    clearCompletedTasks();
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
loadTasks();
renderTasks();
