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

const getAllUsers = async (req, res) => {
  try {
    const usuaris = await usuariService.getAllUsers();
    res.status(200).json({ ok: true, data: usuaris });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const usuari = await usuariService.updateUser(req.params.id, req.body);
    if (!usuari) return res.status(404).json({ ok: false, message: 'Usuari no trobat' });
    res.status(200).json({ ok: true, data: usuari });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const usuari = await usuariService.deleteUser(req.params.id);
    if (!usuari) return res.status(404).json({ ok: false, message: 'Usuari no trobat' });
    res.status(200).json({ ok: true, message: 'Usuari eliminat correctament' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = {
  perfil,
  getAllUsers,
  updateUser,
  deleteUser
};