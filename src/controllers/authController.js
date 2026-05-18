const usuariService = require('../services/usuariServices');

// Ejercicio 4.2 Registre d’usuaris
const register = async (req, res) => {
  try {
    const usuariCreat = await usuariService.registroUsuari(req.body);
    res.status(201).json({ ok: true, data: usuariCreat });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
};

// Ejercicio 4.3 Login amb JWT
const login = async (req, res) => {
  try {
    const usuariAutenticat = await usuariService.loginUsuari(req.body);
    
    // 📸 SCREENSHOT: Logging d'autenticació (Login correcte)
    if (req.log) {
      req.log.info({
        userId: usuariAutenticat.usuari._id,
        email: usuariAutenticat.usuari.email
      }, 'User logged in successfully');
    }
    
    res.status(200).json({ ok: true, data: usuariAutenticat });
  } catch (error) {
    // 📸 SCREENSHOT: Logging d'autenticació (Login incorrecte)
    if (req.log) {
      req.log.warn({
        email: req.body.email
      }, 'Invalid login attempt');
    }
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
};

// Ejercicio 4.4 Refresh token
const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ ok: false, message: 'Refresh token necessari' });

    const usuari = await usuariService.findUsuariByRefreshToken(token);
    if (!usuari) return res.status(403).json({ ok: false, message: 'Token invàlid' });

    const newRefreshToken = await usuariService.rotarRefreshToken(usuari, token);
    const newAccessToken = usuariService.generarAccessToken(usuari);

    res.status(200).json({
      ok: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, message: error.message });
  }
};

// Ejercicio 4.5 Logout
const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ ok: false, message: 'Refresh token necessari' });

    const usuari = await usuariService.findUsuariByRefreshToken(token);
    if (usuari) {
      await usuariService.logoutUsuari(usuari, token);
      
      // 📸 SCREENSHOT: Logging d'autenticació (Logout)
      if (req.log) {
        req.log.info({
          userId: usuari._id
        }, 'User logged out');
      }
    }

    res.status(200).json({ ok: true, message: 'Logout correcte' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error fent logout' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
