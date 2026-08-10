const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for dev flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careercraft_ai';
mongoose.set('bufferCommands', false); // Disable buffering so calls don't hang if DB is offline

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('✅ MongoDB connected successfully to:', MONGODB_URI))
  .catch(err => {
    console.warn('⚠️ MongoDB connection warning (Running with in-memory fallback mode):', err.message);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'CareerCraft AI Backend API',
    timestamp: new Date(),
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim())
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CareerCraft AI Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
