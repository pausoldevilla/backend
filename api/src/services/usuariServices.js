const Usuari = require('../models/Usuari');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registroUsuari = async ({ nom, email, contrasenya }) => {
  const existe = await Usuari.findOne({ email });
  if (existe) {
    const error = new Error('Email ja està en ús');
    error.status = 409;
    throw error;
  }

  const nouUsuari = await Usuari.create({
    nom,
    email,
    contrasenya,
  });

  const usuariSenseContrasenya = nouUsuari.toObject();
  delete usuariSenseContrasenya.contrasenya;

  return usuariSenseContrasenya;
};

const generarAccessToken = (usuari) => {
  return jwt.sign(
    { id: usuari._id, email: usuari.email, rol: usuari.rol },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '15m' }
  );
};

const generarRefreshToken = async (usuari) => {
  const token = jwt.sign(
    { id: usuari._id },
    process.env.JWT_REFRESH_SECRET || 'refreshsecret',
    { expiresIn: '7d' }
  );

  usuari.refreshTokens.push({ token });
  await usuari.save();

  return token;
};

const rotarRefreshToken = async (usuari, oldToken) => {
  usuari.refreshTokens = usuari.refreshTokens.filter(t => t.token !== oldToken);
  const newToken = await generarRefreshToken(usuari);
  return newToken;
};

const loginUsuari = async ({ email, contrasenya }) => {
  const usuari = await Usuari.findOne({ email });
  if (!usuari) {
    const error = new Error('Credencials incorrectes');
    error.status = 401;
    throw error;
  }

  const esValid = await usuari.matchPassword(contrasenya);
  if (!esValid) {
    const error = new Error('Credencials incorrectes');
    error.status = 401;
    throw error;
  }

  const accessToken = generarAccessToken(usuari);
  const refreshToken = await generarRefreshToken(usuari);

  const usuariSenseContrasenya = usuari.toObject();
  delete usuariSenseContrasenya.contrasenya;

  return { usuari: usuariSenseContrasenya, accessToken, refreshToken };
};

module.exports = {
  registroUsuari,
  loginUsuari,
  generarAccessToken,
  generarRefreshToken,
  rotarRefreshToken
};
