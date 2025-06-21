const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const auth = require('../middleware/auth');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, confirmPassword, category } = req.body;

  try {
    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !confirmPassword || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (confirmPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(confirmPassword, 12);
    const newUser = new User({ 
      firstName, 
      lastName, 
      email: email.toLowerCase(), 
      phoneNumber, 
      password: hashedPassword, 
      category 
    });
    
    await newUser.save();

    const token = generateToken(newUser._id);
    const user = await User.findById(newUser._id).select('-password');

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: {
        id: user._id,
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        category: user.category,
        avatar: user.avatar
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user._id,
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        category: user.category,
        avatar: user.avatar
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, shopName, shopDescription } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (shopName && user.category === 'seller') user.shopName = shopName;
    if (shopDescription && user.category === 'seller') user.shopDescription = shopDescription;

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add address
router.post('/addresses', auth, async (req, res) => {
  try {
    const { fullName, phone, address, city, postalCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      fullName,
      phone,
      address,
      city,
      postalCode,
      country: country || 'Bangladesh',
      isDefault: isDefault || false
    });

    await user.save();
    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.category !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;