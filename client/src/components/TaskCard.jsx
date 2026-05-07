import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask, projects } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
    projectId: task.projectId?._id || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      projectId: task.projectId?._id || '',
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        title: editData.title,
        description: editData.description,
        status: editData.status,
        priority: editData.priority,
        deadline: editData.deadline ? new Date(editData.deadline) : null,
        projectId: editData.projectId || null,
      };
      await updateTask(task._id, updateData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update task: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id);
      } catch (error) {
        alert('Failed to delete task: ' + error.message);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus });
    } catch (error) {
      alert('Failed to update task status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description"
            rows="3"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={editData.deadline}
              onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={editData.projectId}
              onChange={(e) => setEditData({ ...editData, projectId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ').toUpperCase()}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
        {task.projectId && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {task.projectId.name}
          </span>
        )}
      </div>

      {task.deadline && (
        <div className="text-sm text-gray-500 mb-4">
          📅 Due: {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusChange('pending')}
            className={`px-2 py-1 text-xs rounded ${task.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={`px-2 py-1 text-xs rounded ${task.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('done')}
            className={`px-2 py-1 text-xs rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;