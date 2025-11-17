const usuariService = require('../services/usuariServices');

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

module.exports = {
  registro,
  login
};
