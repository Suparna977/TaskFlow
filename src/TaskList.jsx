import TaskItem from './TaskItem.jsx';
import { BroomIcon } from './icons.jsx';

function TaskList({
  tasks,
  totalCount,
  completedCount,
  hasActiveFilters,
  onClearFilters,
  onClearCompleted,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  return (
    <section className="task-list" aria-label="Your tasks">
      <div className="task-list-header">
        <h2>
          Your Tasks <span className="count-pill">{tasks.length}</span>
        </h2>

        <button
          type="button"
          className="btn btn-sm"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
        >
          <BroomIcon size={16} />
          Clear completed
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            {totalCount === 0 ? '📝' : '🔍'}
          </span>
          {totalCount === 0 ? (
            <>
              <h2>No tasks yet</h2>
              <p>Add your first task to get started!</p>
            </>
          ) : (
            <>
              <h2>No matching tasks</h2>
              <p>Nothing fits your current search or filters.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={onClearFilters}
                >
                  Clear filters
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <ul className="task-items">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;
