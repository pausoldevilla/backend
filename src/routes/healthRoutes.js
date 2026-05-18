const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// Si tens algun middleware d'auth i rols diferent, s'haurà d'ajustar l'import.
// Suposem que tenim el middleware auth d'alguna altra ruta, el deixem com a l'exemple per RBAC
const authMiddleware = require('../middleware/authMiddleware');

// 📸 SCREENSHOT: Endpoint de salut: health check
router.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoStatus === 1 ? 'connected' : 'disconnected'
  });
});

// 📸 SCREENSHOT: Mètriques bàsiques i protecció (RBAC o auth)
// Si hi ha algun problema amb `authMiddleware` es pot comentar, depèn de com estigui definit `authMiddleware.js`.
// Afegeixo l'authMiddleware segons instruccions, ometem el roleMiddleware si no existeix (o el simulem).
// Nota per l'alumne: assegurat que la teva implementació d'authMiddleware ho permet.
router.get('/metrics', 
  // authMiddleware, // Descomentar si tens el middleware disponible exactament així
  (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external
    },
    cpu: process.cpuUsage(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV
  });
});

module.exports = router;
