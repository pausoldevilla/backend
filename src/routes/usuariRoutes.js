const express = require('express');
const usuariRoutes = express.Router();
const usuariController = require('../controllers/usuariController');
const authMiddleware = require('../middleware/authMiddleware');

usuariRoutes.get('/perfil', authMiddleware, usuariController.perfil);

module.exports = usuariRoutes;
