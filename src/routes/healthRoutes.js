const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoStatus === 1 ? 'connected' : 'disconnected'
  });
});

router.get('/metrics', 
  authMiddleware, 
  roleMiddleware('admin'), 
  (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: memoryUsage,
    cpu: process.cpuUsage(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV
  });
});

module.exports = router;
