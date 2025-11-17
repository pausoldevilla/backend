const Usuari = require('../models/Usuari');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Funció per a registrar usuari
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

const loginUsuari = async ({ email, contrasenya }) => {
  const usuari = await Usuari.findOne({ email });
  
  if (!usuari) {
    const error = new Error('Credencials incorrectes');
    error.status = 401;
    throw error;
  }

  const esValid = await usuari.compararPassword(contrasenya); 
  
  if (!esValid) {
    const error = new Error('Credencials incorrectes');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuari._id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '2h' }
  );
  
  const usuariSenseContrasenya = usuari.toObject();
  delete usuariSenseContrasenya.contrasenya;

  return { usuari: usuariSenseContrasenya, token };
};

module.exports = {
  registroUsuari,
  loginUsuari
};