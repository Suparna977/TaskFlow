import { useState } from 'react';
import PriorityPicker from './PriorityPicker.jsx';
import { CheckIcon, PencilIcon, TrashIcon } from './icons.jsx';
import { CATEGORIES, PRIORITIES, formatDate, getDueStatus } from './utils.js';

function TaskItem({ task, onToggleTask, onDeleteTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const status = getDueStatus(task);
  const category =
    CATEGORIES.find((c) => c.value === task.category) ??
    CATEGORIES[CATEGORIES.length - 1];
  const priorityLabel = PRIORITIES.find((p) => p.value === task.priority)?.label;

  function startEditing() {
    // Copy the latest task values each time editing starts.
    setDraft({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setIsEditing(true);
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();

    const title = draft.title.trim();
    if (!title) return;

    onEditTask({
      ...task,
      ...draft,
      title,
      description: draft.description.trim(),
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className={`task-card editing priority-${draft.priority}`}>
        <form
          className="task-edit"
          onSubmit={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor={`edit-title-${task.id}`}>
              Title
            </label>
            <input
              id={`edit-title-${task.id}`}
              className="field"
              value={draft.title}
              onChange={(e) => updateDraft('title', e.target.value)}
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`edit-desc-${task.id}`}>
              Description
            </label>
            <textarea
              id={`edit-desc-${task.id}`}
              className="field"
              value={draft.description}
              onChange={(e) => updateDraft('description', e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          <PriorityPicker
            name={`edit-priority-${task.id}`}
            value={draft.priority}
            onChange={(value) => updateDraft('priority', value)}
          />

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor={`edit-cat-${task.id}`}>
                Category
              </label>
              <select
                id={`edit-cat-${task.id}`}
                className="field"
                value={draft.category}
                onChange={(e) => updateDraft('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor={`edit-date-${task.id}`}>
                Due date
              </label>
              <input
                id={`edit-date-${task.id}`}
                className="field"
                type="date"
                value={draft.dueDate}
                onChange={(e) => updateDraft('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="edit-actions">
            <button type="button" className="btn btn-sm" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!draft.title.trim()}
            >
              Save changes
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`task-card priority-${task.priority}${
        task.completed ? ' is-completed' : ''
      }`}
    >
      <div className="task-main">
        <span className="task-check">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            aria-label={`Mark "${task.title}" as ${
              task.completed ? 'pending' : 'completed'
            }`}
          />
          <span className="check-box" aria-hidden="true">
            <CheckIcon size={14} />
          </span>
        </span>

        <div className="task-body">
          <h3 className="task-title">{task.title}</h3>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <span className={`chip priority-badge ${task.priority}`}>
              {priorityLabel} priority
            </span>
            <span className="chip">
              <span aria-hidden="true">{category.icon}</span> {category.label}
            </span>
            <span className="chip">
              <span aria-hidden="true">📅</span>{' '}
              {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            </span>
            {status.key !== 'no-date' && (
              <span className={`chip due-status ${status.key}`}>
                {status.label}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={startEditing}
            aria-label={`Edit "${task.title}"`}
            title="Edit"
          >
            <PencilIcon size={17} />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Delete "${task.title}"`}
            title="Delete"
          >
            <TrashIcon size={17} />
          </button>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;
