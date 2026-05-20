require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./models');
const { initTransporter } = require('./services/email');

// Route imports
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const startupRoutes = require('./routes/startups');
const memberRoutes = require('./routes/members');
const resourceRoutes = require('./routes/resources');
const paymentRoutes = require('./routes/payments');
const supportRoutes = require('./routes/support');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// ── Ensure upload directories exist ──
const uploadDirs = ['uploads/pitch_decks', 'uploads/photos'];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/support', supportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start Server ──
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    initTransporter();

    app.listen(PORT, () => {
      console.log(`\n🚀 SJRI Incubation Server running on http://localhost:${PORT}`);
      console.log(`   API Base: http://localhost:${PORT}/api`);
      console.log(`   Health:   http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
