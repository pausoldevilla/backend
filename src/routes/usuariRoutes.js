const express = require('express');
const usuariRoutes = express.Router();
const usuariController = require('../controllers/usuariController');
const authMiddleware = require('../middleware/authMiddleware');

usuariRoutes.post('/registro', usuariController.registro);
usuariRoutes.post('/login', usuariController.login);
usuariRoutes.post('/refresh', usuariController.refresh);

usuariRoutes.get('/perfil', authMiddleware, usuariController.perfil);

module.exports = usuariRoutes;
