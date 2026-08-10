const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'careercraft_ai_super_secret_jwt_key_2026';

// In-memory fallback user database for offline DB scenarios
const inMemoryUsers = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (isDbConnected()) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const user = new User({
        name,
        email,
        password,
        targetRole: targetRole || 'Full Stack Developer',
        experienceLevel: experienceLevel || 'Mid Level'
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, targetRole: user.targetRole },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel
        }
      });
    } else {
      // In-Memory Fallback Mode
      let existing = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: 'mem_usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        targetRole: targetRole || 'Full Stack Developer',
        experienceLevel: experienceLevel || 'Mid Level'
      };

      inMemoryUsers.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email, targetRole: newUser.targetRole },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          targetRole: newUser.targetRole,
          experienceLevel: newUser.experienceLevel
        }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, targetRole: user.targetRole },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel
        }
      });
    } else {
      // In-Memory Fallback Mode
      let user = inMemoryUsers.find(u => u.email === email.toLowerCase());
      
      // Auto register for demo credentials if not found in memory
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = {
          id: 'mem_usr_' + Date.now(),
          name: email.split('@')[0] || 'Developer User',
          email: email.toLowerCase(),
          password: hashedPassword,
          targetRole: 'Full Stack Developer',
          experienceLevel: 'Mid Level'
        };
        inMemoryUsers.push(user);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, targetRole: user.targetRole },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel
        }
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    }
    
    // In-memory fallback lookup
    const user = inMemoryUsers.find(u => u.id === req.user.id) || {
      id: req.user.id,
      name: req.user.name || 'Developer User',
      email: req.user.email || 'user@example.com',
      targetRole: req.user.targetRole || 'Full Stack Developer',
      experienceLevel: 'Mid Level'
    };

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
});

module.exports = router;
