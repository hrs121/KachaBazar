const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
    const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword });
    await newUser.save();

    const user = await User.findOne({ email });
    res.status(200).json({ message: 'User registered successfully', user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber } });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;