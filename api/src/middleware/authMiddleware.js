const jwt = require('jsonwebtoken');
const Usuari = require('../models/Usuari');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("MIDDLEWARE FAIL 1: No hi ha 'Bearer' token al request.");
        return res.status(401).json({ ok: false, message: 'No token proporcionat' });
    }

    const token = authHeader.split(' ')[1];
    
    const secret = process.env.JWT_SECRET || 'secretkey';
    console.log(`MIDDLEWARE LOG 2: Intentant verificar el token amb el secret: [${secret}]`);

    const decoded = jwt.verify(token, secret);

    console.log(`MIDDLEWARE SUCCESS 3: Token verificat. ID: ${decoded.id}`);

    const usuari = await Usuari.findById(decoded.id);
    
    if (!usuari) {
        console.error("MIDDLEWARE FAIL 4: L'ID del token no és a la DB.");
        return res.status(401).json({ ok: false, message: 'Usuari no trobat' });
    }

    console.log(`MIDDLEWARE SUCCESS 5: Usuari trobat (${usuari.email}). Accés concedit.`);
    req.usuari = usuari;
    next(); 
    
  } catch (error) {
    console.error("MIDDLEWARE FAIL (JWT Error):", error.name, error.message);
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ ok: false, message: 'Token caducat' });
    }
    
    res.status(401).json({ ok: false, message: 'Token invàlid' });
  }
};

module.exports = authMiddleware;