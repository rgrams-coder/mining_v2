const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin or own profile)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is authorized (admin or own profile)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin or own profile)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is authorized (admin or own profile)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Only admin can update role
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to change role' });
    }
    
    // Update fields
    if (req.body.username) {
      // Ensure username is not empty
      if (!req.body.username.trim()) {
        return res.status(400).json({ msg: 'Username cannot be empty' });
      }
      user.username = req.body.username;
    }
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.role && req.user.role === 'admin') user.role = req.body.role;
    if (req.body.subscription) user.subscription = req.body.subscription;
    
    await user.save();
    
    // Don't send password back
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    };
    
    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    await user.remove();
    
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;