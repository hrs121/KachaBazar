const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users-simple');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, confirmPassword, category } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
    const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, category });
    await newUser.save();    const user = await User.findOne({ email });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        category: user.category 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'User registered successfully', 
      token,
      user: { 
        id: user._id,
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        category: user.category 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        category: user.category 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user._id,
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        category: user.category 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
