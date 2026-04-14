const express = require('express');
const router = express.Router();
const comandaService = require('../services/comandaService');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/comandes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const data = {
            ...req.body,
            usuari: req.usuari._id
        };
        const comanda = await comandaService.createComanda(data);
        res.status(201).json({ status: 'success', data: comanda });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// GET /api/comandes/user
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const comandes = await comandaService.getComandesUsuari(req.usuari._id);
        res.json({ status: 'success', data: comandes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /api/comandes/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const comanda = await comandaService.getComandaById(req.params.id);
        if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
        res.json({ status: 'success', data: comanda });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/comandes/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const comanda = await comandaService.updateComanda(req.params.id, req.body);
        if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
        res.json({ status: 'success', data: comanda });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * tags:
 *   name: Comandes
 *   description: Rutes de comandes (pedidos)
 */

/**
 * @swagger
 * /api/comandes:
 *   post:
 *     summary: Crear una nova comanda
 *     tags: [Comandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Comanda creada
 *       400:
 *         description: Error en la comanda
 */

/**
 * @swagger
 * /api/comandes/user:
 *   get:
 *     summary: Obtenir comandes de l'usuari autenticat
 *     tags: [Comandes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista de comandes de l'usuari
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/comandes/{id}:
 *   get:
 *     summary: Obtenir una comanda per ID
 *     tags: [Comandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalls de la comanda
 *       404:
 *         description: Comanda no trobada
 *   put:
 *     summary: Actualitzar una comanda (completar pagament)
 *     tags: [Comandes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pagat:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comanda actualitzada
 *       404:
 *         description: Comanda no trobada
 */

module.exports = router;
