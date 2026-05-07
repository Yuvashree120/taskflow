const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects
router.get('/', getProjects);

// Get single project
router.get('/:projectId', getProjectById);

// Create project
router.post('/', createProject);

// Update project
router.put('/:projectId', updateProject);

// Delete project
router.delete('/:projectId', deleteProject);

// Add member to project
router.post('/:projectId/members', addMember);

// Remove member from project
router.delete('/:projectId/members/:memberId', removeMember);

module.exports = router;