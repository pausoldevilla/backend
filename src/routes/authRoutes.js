const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints d'autenticació
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registre d'un nou usuari
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuari registrat
 *       400:
 *         description: Error en el registre
 */

// 4.4 Documentar endpoints: Exemple de ruta documentada (login)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login d'usuari
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcte
 *       401:
 *         description: Credencials incorrectes
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar el token JWT
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refrescat
 *       401:
 *         description: No autoritzat
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout de l'usuari
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: S'ha tancat la sessió
 */

module.exports = authRoutes;
