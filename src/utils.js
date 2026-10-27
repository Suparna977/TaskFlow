export const STORAGE_KEY = 'tasks';

export const CATEGORIES = [
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'personal', label: 'Personal', icon: '🏠' },
  { value: 'study', label: 'Study', icon: '📚' },
  { value: 'health', label: 'Health', icon: '💪' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const SORT_OPTIONS = [
  { value: 'priority', label: 'Priority: High to Low' },
  { value: 'dueDate', label: 'Due date: Earliest first' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title: A to Z' },
];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const DAY_MS = 86_400_000;

/* ---------- ids & dates ---------- */

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Local-time YYYY-MM-DD (avoids the UTC shift that toISOString() causes).
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysBetween(fromISO, toISO) {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to - from) / DAY_MS);
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/* ---------- due-date status ---------- */

export function getDueStatus(task, today = todayISO()) {
  if (task.completed) return { key: 'completed', label: 'Completed' };
  if (!task.dueDate) return { key: 'no-date', label: 'No deadline' };

  const diff = daysBetween(today, task.dueDate);

  if (diff < 0) {
    return { key: 'overdue', label: `Overdue by ${plural(-diff, 'day')}` };
  }
  if (diff === 0) return { key: 'due-today', label: 'Due today' };
  if (diff === 1) return { key: 'due-tomorrow', label: 'Due tomorrow' };
  return { key: 'upcoming', label: `Due in ${plural(diff, 'day')}` };
}

/* ---------- sorting & filtering ---------- */

export function sortTasks(tasks, sortBy) {
  const byPriority = (a, b) =>
    (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);

  // Tasks without a due date always go last.
  const byDueDate = (a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  };

  const byCreated = (a, b) => a.createdAt.localeCompare(b.createdAt);

  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return byDueDate(a, b) || byPriority(a, b) || byCreated(a, b);
      case 'title':
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      case 'newest':
        return byCreated(b, a);
      case 'oldest':
        return byCreated(a, b);
      case 'priority':
      default:
        return byPriority(a, b) || byDueDate(a, b) || byCreated(a, b);
    }
  });
}

export function matchesSearch(task, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q)
  );
}

/* ---------- storage, import & export ---------- */

// Makes sure any task (old saved data or an imported file) has every field.
export function normalizeTask(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.title !== 'string') {
    return null;
  }

  const title = raw.title.trim().slice(0, 100);
  if (!title) return null;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    title,
    description:
      typeof raw.description === 'string'
        ? raw.description.trim().slice(0, 500)
        : '',
    priority: Object.hasOwn(PRIORITY_RANK, raw.priority)
      ? raw.priority
      : 'medium',
    category: CATEGORIES.some((c) => c.value === raw.category)
      ? raw.category
      : 'other',
    dueDate: /^\d{4}-\d{2}-\d{2}$/.test(raw.dueDate) ? raw.dueDate : '',
    completed: Boolean(raw.completed),
    createdAt:
      typeof raw.createdAt === 'string' && raw.createdAt
        ? raw.createdAt
        : new Date().toISOString(),
  };
}

export function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.map(normalizeTask).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function parseImport(text) {
  const data = JSON.parse(text);
  const list = Array.isArray(data) ? data : data?.tasks;
  if (!Array.isArray(list)) throw new Error('Invalid file');
  return list.map(normalizeTask).filter(Boolean);
}

export function downloadTasks(tasks) {
  const payload = JSON.stringify(
    { app: 'taskflow', version: 2, exportedAt: new Date().toISOString(), tasks },
    null,
    2
  );
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskflow-tasks-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
