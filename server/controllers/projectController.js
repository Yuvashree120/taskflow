const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');

// Get all projects for a user (as owner or member)
const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate('owner', 'name email')
    .populate('members', 'name email');

  res.status(200).json(projects);
});

// Get a single project by ID
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  const project = await Project.findById(projectId)
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner or member
  if (project.owner._id.toString() !== userId && !project.members.includes(userId)) {
    return res.status(403).json({ message: 'Not authorized to view this project' });
  }

  res.status(200).json(project);
});

// Create a new project
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const project = new Project({
    name,
    description,
    deadline,
    owner: userId,
    members: [userId], // Owner is automatically a member
  });

  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(201).json(project);
});

// Update a project
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status, deadline } = req.body;
  const userId = req.user.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  if (project.owner.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to update this project' });
  }

  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (deadline) project.deadline = deadline;

  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json(project);
});

// Delete a project
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  if (project.owner.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to delete this project' });
  }

  await Project.findByIdAndDelete(projectId);

  res.status(200).json({ message: 'Project deleted successfully' });
});

// Add member to project
const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;
  const userId = req.user.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  if (project.owner.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to add members to this project' });
  }

  if (!memberId) {
    return res.status(400).json({ message: 'Member ID is required' });
  }

  if (project.members.includes(memberId)) {
    return res.status(400).json({ message: 'Member already in project' });
  }

  project.members.push(memberId);
  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json(project);
});

// Remove member from project
const removeMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user.id;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  if (project.owner.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to remove members from this project' });
  }

  project.members = project.members.filter((m) => m.toString() !== memberId);
  await project.save();
  await project.populate('owner', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json(project);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};