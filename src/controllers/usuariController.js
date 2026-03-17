const usuariService = require('../services/usuariServices');

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
  perfil
};