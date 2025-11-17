const express = require('express');
const usuariRoutes = express.Router();
const usuariController = require('../controllers/usuariController');

usuariRoutes.post('/registro', usuariController.registro);
usuariRoutes.post('/login', usuariController.login);

module.exports = usuariRoutes;
