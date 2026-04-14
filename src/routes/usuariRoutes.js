const express = require('express');
const usuariRoutes = express.Router();
const usuariController = require('../controllers/usuariController');
const authMiddleware = require('../middleware/authMiddleware');

usuariRoutes.get('/perfil', authMiddleware, usuariController.perfil);

/**
 * @swagger
 * tags:
 *   name: Usuari
 *   description: Rutes d'usuari
 */

// 4.4 Documentar endpoints: Exemple de ruta documentada (perfil d'usuari)
/**
 * @swagger
 * /api/usuari/perfil:
 *   get:
 *     summary: Obtenir el perfil de l'usuari autenticat
 *     tags: [Usuari]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de l'usuari
 *       401:
 *         description: No autoritzat
 */

module.exports = usuariRoutes;
