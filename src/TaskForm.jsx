import { useState } from 'react';
import PriorityPicker from './PriorityPicker.jsx';
import { PlusIcon } from './icons.jsx';
import { CATEGORIES, createId, todayISO } from './utils.js';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddTask({
      id: createId(),
      title: cleanTitle,
      description: description.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    // Reset the form after adding the task (category is kept for quick entry)
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add a New Task</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="task-title">
          Task title <span aria-hidden="true">*</span>
        </label>
        <input
          id="task-title"
          className="field"
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          className="field"
          placeholder="Add some details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>

      <PriorityPicker
        name="new-task-priority"
        value={priority}
        onChange={setPriority}
      />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="task-category">
            Category
          </label>
          <select
            id="task-category"
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-due-date">
            Due date
          </label>
          <input
            id="task-due-date"
            className="field"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={todayISO()}
          />
        </div>
      </div>

      <button
        className="btn btn-primary task-submit"
        type="submit"
        disabled={!title.trim()}
      >
        <PlusIcon size={18} />
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
