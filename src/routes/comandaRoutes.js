const express = require('express');
const router = express.Router();
const comandaService = require('../services/comandaService');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/comandes — Crear pedido (requiere auth)
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

// GET /api/comandes/user — Pedidos del usuario autenticado
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const comandes = await comandaService.getComandesUsuari(req.usuari._id);
        res.json({ status: 'success', data: comandes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /api/comandes/:id — Pedido por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const comanda = await comandaService.getComandaById(req.params.id);
        if (!comanda) return res.status(404).json({ status: 'error', message: 'Comanda no trobada' });
        res.json({ status: 'success', data: comanda });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
