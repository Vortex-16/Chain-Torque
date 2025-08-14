const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, userType, phoneNumber, organization } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      userType: userType || 'buyer',
      phoneNumber,
      organization
    });

    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType
    };

    res.status(201).json({ 
      message: 'Registration successful', 
      user: req.session.user,
      redirectUrl: 'http://localhost:8082' // Redirect to marketplace
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType, phoneNumber, organization } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update user info if provided
    if (userType && userType !== user.userType) {
      user.userType = userType;
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (organization && organization !== user.organization) {
      user.organization = organization;
    }
    
    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      organization: user.organization
    };

    res.json({ 
      message: 'Login successful', 
      user: req.session.user,
      redirectUrl: 'http://localhost:8082' // Redirect to marketplace
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

module.exports = { router, requireAuth };
