import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

function Dashboard() {
  const { tasks, projects, loading, error, loadTasks } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    projectId: '',
    priority: '',
  });

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.projectId && task.projectId?._id !== filter.projectId) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    return true;
  });

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === 'pending'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    done: filteredTasks.filter(task => task.status === 'done'),
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilter({ status: '', projectId: '', priority: '' });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your tasks and projects</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button
              onClick={loadTasks}
              className="text-red-700 hover:text-red-900 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-medium text-gray-700">Filter:</span>

          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filter.projectId}
            onChange={(e) => handleFilterChange('projectId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>

          <select
            value={filter.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {(filter.status || filter.projectId || filter.priority) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{tasksByStatus.pending.length}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{tasksByStatus['in-progress'].length}</div>
          <div className="text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{tasksByStatus.done.length}</div>
          <div className="text-gray-600">Completed</div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            Pending ({tasksByStatus.pending.length})
          </h3>
          <div className="space-y-4">
            {tasksByStatus.pending.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
            {tasksByStatus.pending.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No pending tasks
              </div>
            )}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            In Progress ({tasksByStatus['in-progress'].length})
          </h3>
          <div className="space-y-4">
            {tasksByStatus['in-progress'].map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
            {tasksByStatus['in-progress'].length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No tasks in progress
              </div>
            )}
          </div>
        </div>

        {/* Done Tasks */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Done ({tasksByStatus.done.length})
          </h3>
          <div className="space-y-4">
            {tasksByStatus.done.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
            {tasksByStatus.done.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No completed tasks
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}

export default Dashboard;
