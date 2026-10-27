import { getDueStatus } from './utils.js';

function Dashboard({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (task) => getDueStatus(task).key === 'overdue'
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    { title: 'Total', count: totalTasks, icon: '📋', type: 'total' },
    { title: 'Pending', count: pendingTasks, icon: '⏳', type: 'pending' },
    { title: 'Completed', count: completedTasks, icon: '✅', type: 'completed' },
    { title: 'Overdue', count: overdueTasks, icon: '🔥', type: 'overdue' },
  ];

  let message = 'Keep going! You are making progress.';
  if (totalTasks === 0) message = 'Add your first task to get started!';
  else if (progress === 100) message = 'Amazing! All tasks completed!';
  else if (overdueTasks > 0)
    message = `${overdueTasks} overdue — tackle ${
      overdueTasks === 1 ? 'it' : 'them'
    } first.`;
  else if (progress === 0) message = 'A fresh start — pick one task and begin.';

  return (
    <section className="dashboard" aria-label="Task summary">
      {stats.map((stat) => (
        <div className={`stat-card ${stat.type}`} key={stat.type}>
          <div className="stat-info">
            <h3>{stat.title}</h3>
            <p>{stat.count}</p>
          </div>
          <span className="stat-icon" aria-hidden="true">
            {stat.icon}
          </span>
        </div>
      ))}

      <div className="progress-card">
        <div className="progress-header">
          <div>
            <h3>Task Completion</h3>
            <p>
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <span className="progress-percentage">{progress}%</span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="Task completion"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="progress-message">{message}</p>
      </div>
    </section>
  );
}

export default Dashboard;
