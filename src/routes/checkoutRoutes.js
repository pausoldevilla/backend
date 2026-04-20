const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta per crear la sessió de Stripe (protegida)
router.post('/create-session', authMiddleware, checkoutController.createCheckoutSession);

// Ruta per al webhook de Stripe (PÚBLICA i sense processar body com JSON automàticament)
// Aquesta ruta es registrarà a index.js amb un tractament especial per al raw body.
router.post('/webhook', checkoutController.handleWebhook);

module.exports = router;
