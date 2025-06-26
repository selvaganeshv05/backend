const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const User       = require('./models/User');

dotenv.config();

const app = express();

// 1) MIDDLEWARE
app.use(cors());
app.use(express.json());    // must come before your routes

// 2) DATABASE CONNECT
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 3) REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  // 🔥 DEBUG LINE: what is coming in?
  console.log('🛠️  Register endpoint hit, req.body =', req.body);
  
  const { username, password } = req.body;
  
  try {
    // check for existing user
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: '❌ Username already exists' });
    }

    // hash & save
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    return res.status(201).json({ message: '✅ User registered successfully' });
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json({ 
      message: '❌ Error creating user',
      error: err.message
    });
  }
});

// 4) LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '❌ Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: '❌ Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({
      message: '❌ Server error during login',
      error: err.message
    });
  }
});

// 5) START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
