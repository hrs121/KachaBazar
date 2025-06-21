const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KachaBazar API is running',
    timestamp: new Date().toISOString()
  });
});

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue without MongoDB connection');
});

// Add routes after confirming basic server works
try {
  app.use('/api/users', require('./routes/users-simple'));
  console.log('Users routes loaded successfully');
} catch (error) {
  console.error('Error loading users routes:', error.message);
}

try {
  app.use('/api/products', require('./routes/products-simple'));
  console.log('Products routes loaded successfully');
} catch (error) {
  console.error('Error loading products routes:', error.message);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({ error: 'Duplicate entry' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
