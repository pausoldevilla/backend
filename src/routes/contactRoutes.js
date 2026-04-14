const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.sendEmail);

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Rutes de contacte
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar un email de contacte
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviat correctament
 *       400:
 *         description: Error en l'enviament
 */

module.exports = router;