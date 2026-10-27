import { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import TaskForm from './TaskForm.jsx';
import Toolbar from './Toolbar.jsx';
import TaskList from './TaskList.jsx';
import Toast from './Toast.jsx';
import Footer from './Footer.jsx';
import { useStoredState, useTheme } from './hooks.js';
import {
  STORAGE_KEY,
  SORT_OPTIONS,
  downloadTasks,
  loadTasks,
  matchesSearch,
  sortTasks,
} from './utils.js';
import './App.css';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [storedSort, setSortBy] = useStoredState('taskflow-sort', 'priority');
  const [toast, setToast] = useState(null);
  const [theme, toggleTheme] = useTheme();

  // Ignore an unknown saved sort value (e.g. from an older version).
  const sortBy = SORT_OPTIONS.some((o) => o.value === storedSort)
    ? storedSort
    : 'priority';

  /* ---------- persistence ---------- */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage unavailable — keep working in memory.
    }
  }, [tasks]);

  /* ---------- toast (info + undo) ---------- */

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(
      () => setToast(null),
      toast.removed ? 8000 : 4000
    );
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(message) {
    setToast({ message, removed: null });
  }

  /* ---------- task actions ---------- */

  function addTask(newTask) {
    setTasks((prev) => [...prev, newTask]);
  }

  function toggleTask(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function editTask(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  // Removes tasks but remembers them (and their position) so they can be restored.
  function removeTasks(shouldRemove, message) {
    const removed = tasks
      .map((task, index) => ({ task, index }))
      .filter(({ task }) => shouldRemove(task));

    if (removed.length === 0) return;

    setTasks((prev) => prev.filter((task) => !shouldRemove(task)));
    setToast({ message, removed });
  }

  function deleteTask(taskId) {
    const target = tasks.find((task) => task.id === taskId);
    if (!target) return;
    removeTasks((task) => task.id === taskId, `"${target.title}" deleted.`);
  }

  function clearCompletedTasks() {
    const count = tasks.filter((task) => task.completed).length;
    removeTasks(
      (task) => task.completed,
      `Cleared ${plural(count, 'completed task')}.`
    );
  }

  function undoRemove() {
    if (!toast?.removed) return;

    const restore = [...toast.removed].sort((a, b) => a.index - b.index);

    setTasks((prev) => {
      const next = [...prev];
      restore.forEach(({ task, index }) => {
        next.splice(Math.min(index, next.length), 0, task);
      });
      return next;
    });
    setToast(null);
  }

  function importTasks(incoming) {
    const existingIds = new Set(tasks.map((task) => task.id));
    const fresh = incoming.filter((task) => !existingIds.has(task.id));
    const skipped = incoming.length - fresh.length;

    if (fresh.length > 0) {
      setTasks((prev) => [...prev, ...fresh]);
    }

    if (incoming.length === 0) {
      notify('No tasks found in that file.');
    } else if (fresh.length === 0) {
      notify('Those tasks are already in your list.');
    } else {
      notify(
        `Imported ${plural(fresh.length, 'task')}` +
          (skipped > 0 ? ` (${skipped} already existed).` : '.')
      );
    }
  }

  /* ---------- filters & derived data ---------- */

  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      all: tasks.length,
      pending: tasks.length - completed,
      completed,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }
      return matchesSearch(task, search);
    });

    return sortTasks(filtered, sortBy);
  }, [tasks, statusFilter, categoryFilter, search, sortBy]);

  const hasActiveFilters =
    statusFilter !== 'all' || categoryFilter !== 'all' || search.trim() !== '';

  function clearFilters() {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearch('');
  }

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="app-content">
        <Dashboard tasks={tasks} />

        <div className="workspace">
          <aside className="workspace-side">
            <TaskForm onAddTask={addTask} />
          </aside>

          <div className="workspace-main">
            <Toolbar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              counts={counts}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <TaskList
              tasks={visibleTasks}
              totalCount={tasks.length}
              completedCount={counts.completed}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onClearCompleted={clearCompletedTasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
            />
          </div>
        </div>
      </main>

      <Footer
        taskCount={tasks.length}
        onExport={() => downloadTasks(tasks)}
        onImport={importTasks}
        onNotify={notify}
      />

      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.removed ? undoRemove : null}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
