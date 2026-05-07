const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

exports.getTasks = asyncHandler(async (req, res) => {
  const { status, projectId, priority } = req.query;
  const userId = req.user._id;

  // Build filter query
  const filter = { user: userId };
  if (status) filter.status = status;
  if (projectId) filter.projectId = projectId;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate('user', 'name email')
    .populate('assignedUser', 'name email')
    .populate('projectId', 'name');

  res.json(tasks);
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, deadline, projectId, assignedUser } = req.body;
  const userId = req.user._id;

  // Validation
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Task title must be less than 200 characters' });
  }

  if (status && !['pending', 'in-progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid task status' });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid task priority' });
  }

  const task = new Task({
    user: userId,
    title: title.trim(),
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    deadline,
    projectId,
    assignedUser,
  });

  await task.save();
  await task.populate('user', 'name email');
  await task.populate('assignedUser', 'name email');
  await task.populate('projectId', 'name');

  res.status(201).json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, deadline, projectId, assignedUser } = req.body;
  const taskId = req.params.taskId;
  const userId = req.user._id;

  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Validation for updates
  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Task title must be less than 200 characters' });
    }
    task.title = title.trim();
  }

  if (description !== undefined) task.description = description;

  if (status !== undefined) {
    if (!['pending', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid task status' });
    }
    task.status = status;
  }

  if (priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid task priority' });
    }
    task.priority = priority;
  }

  if (deadline !== undefined) task.deadline = deadline;
  if (projectId !== undefined) task.projectId = projectId;
  if (assignedUser !== undefined) task.assignedUser = assignedUser;

  await task.save();
  await task.populate('user', 'name email');
  await task.populate('assignedUser', 'name email');
  await task.populate('projectId', 'name');

  res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user._id;

  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await Task.deleteOne({ _id: taskId });
  res.json({ message: 'Task deleted successfully' });
});
