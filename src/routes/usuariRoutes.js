const express = require('express');
const usuariRoutes = express.Router();
const usuariController = require('../controllers/usuariController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

usuariRoutes.get('/perfil', authMiddleware, usuariController.perfil);

// Admin routes
usuariRoutes.get('/all', authMiddleware, roleMiddleware('admin'), usuariController.getAllUsers);
usuariRoutes.put('/:id', authMiddleware, roleMiddleware('admin'), usuariController.updateUser);
usuariRoutes.delete('/:id', authMiddleware, roleMiddleware('admin'), usuariController.deleteUser);

/**
 * @swagger
 * tags:
 *   name: Usuari
 *   description: Rutes d'usuari
 */

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

/**
 * @swagger
 * /api/usuari/all:
 *   get:
 *     summary: Obtenir tots els usuaris (Admin)
 *     tags: [Usuari]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista d'usuaris
 *       403:
 *         description: Accès denegat
 */

module.exports = usuariRoutes;
