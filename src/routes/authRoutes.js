const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);

module.exports = authRoutes;
