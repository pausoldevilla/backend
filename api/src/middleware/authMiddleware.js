const jwt = require('jsonwebtoken');
const Usuari = require('../models/Usuari');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No token proporcionat' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    const usuari = await Usuari.findById(decoded.id);
    if (!usuari) {
      return res.status(401).json({ ok: false, message: 'Usuari no trobat' });
    }

    req.usuari = usuari;

    next();
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, message: 'Token caducat' });
    }
    res.status(401).json({ ok: false, message: 'Token invàlid' });
  }
};

module.exports = authMiddleware;
