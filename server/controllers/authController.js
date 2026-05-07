const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');

exports.registerUser = asyncHandler(async (req, res) => {
  // TODO: Add input validation and error handling
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  // TODO: Add input validation and error handling
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by authMiddleware
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
});
