const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'KachaBazar API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KachaBazar API is running',
    timestamp: new Date().toISOString()
  });
});

// Basic user routes
const bcrypt = require('bcryptjs');
const mongoose_user = require('mongoose');

const UserSchema = new mongoose_user.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  category: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose_user.model('User', UserSchema);

// Register
app.post('/api/users/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, confirmPassword, category } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
    const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, category });
    await newUser.save();

    const user = await User.findOne({ email });
    res.status(200).json({ message: 'User registered successfully', user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber, category: user.category } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber, category: user.category } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue without MongoDB');
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
