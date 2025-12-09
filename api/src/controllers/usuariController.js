const usuariService = require('../services/usuariServices');
const jwt = require('jsonwebtoken');

const registro = async (req, res) => {
  try {
    const usuariCreat = await usuariService.registroUsuari(req.body);

    res.status(201).json({
      ok: true,
      data: usuariCreat
    });
  } catch (error) {
    res.status(error.status || 500).json({
      ok: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const usuariAutenticat = await usuariService.loginUsuari(req.body);

    res.status(200).json({
      ok: true,
      data: usuariAutenticat
    });
  } catch (error) {
    res.status(error.status || 500).json({
      ok: false,
      message: error.message
    });
  }
};

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
    res.status(error.status || 500).json({
      ok: false,
      message: error.message
    });
  }
};

const perfil = (req, res) => {
  try {
    const usuariSenseContrasenya = { ...req.usuari.toObject() };
    delete usuariSenseContrasenya.contrasenya;

    console.log(`CONTROLLER LOG: Retornant dades per a ${usuariSenseContrasenya.email}`);

    res.status(200).json({
      ok: true,
      usuari: usuariSenseContrasenya 
    });
  } catch (error) {
    console.error("CONTROLLER FAIL: Error retornant perfil.");
    res.status(error.status || 500).json({
      ok: false,
      message: error.message
    });
  }
};

module.exports = {
  registro,
  login,
  refresh,
  perfil
};