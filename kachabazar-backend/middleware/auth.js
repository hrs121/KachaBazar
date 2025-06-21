const jwt = require('jsonwebtoken');
const User = require('../models/users-simple');

const auth = async (req, res, next) => {
  try {    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth error: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove any extra quotes that might be around the token
    token = token.replace(/^"(.*)"$/, '$1');
    console.log('Cleaned token:', token.substring(0, 20) + '...');const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decoded successfully:', { userId: decoded.userId, email: decoded.email });
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('Auth error: User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User authenticated:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = auth;
