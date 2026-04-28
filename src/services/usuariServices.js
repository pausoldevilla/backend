const Usuari = require('../models/Usuari');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secretkey';

const ACCESS_TOKEN_EXPIRATION = '7d';
const REFRESH_TOKEN_EXPIRATION = '30d';


const generarAccessToken = (usuari) => {
    return jwt.sign(
        { id: usuari._id, email: usuari.email, rol: usuari.rol },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );
};

const generarRefreshToken = async (usuari) => {
    const token = jwt.sign(
        { id: usuari._id },
        REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

 
    usuari.refreshTokens.push({ token });
    await usuari.save();

    return token;
};


// Ejercicio 4.2 Registre d'usuaris
const registroUsuari = async (data) => {
    const existe = await Usuari.findOne({ email: data.email });
    if (existe) {
        const error = new Error('Email ja està en ús');
        error.status = 409;
        throw error;
    }

    const nouUsuari = await Usuari.create({
        nom: data.nom,
        titol: data.titol,
        email: data.email,
        contrasenya: data.contrasenya,
        dataNaixement: data.dataNaixement,
        telefon: data.telefon,
        adreca: {
            carrer: data.adreca?.carrer,
            ciutat: data.adreca?.ciutat,
            codiPostal: data.adreca?.codiPostal,
            pais: data.adreca?.pais || "Espanya"
        },
        rol: data.rol || "client"
    });

    const usuariSenseContrasenya = nouUsuari.toObject();
    delete usuariSenseContrasenya.contrasenya;

    return usuariSenseContrasenya;
};


// Ejercicio 4.3 Login amb JWT
const loginUsuari = async ({ email, contrasenya }) => {
    const usuari = await Usuari.findOne({ email }).select('+contrasenya');

    if (!usuari) {
        const error = new Error('Credencials incorrectes');
        error.status = 401;
        throw error;
    }

    if (!usuari.contrasenya) {
        console.error(`Usuario ID ${usuari._id} encontrado, pero campo 'contrasenya' está vacío.`);
        const error = new Error('Error intern: La contrasenya de l\'usuari no està definida.');
        error.status = 500;
        throw error;
    }

    const esValid = await usuari.matchPassword(contrasenya);
    if (!esValid) {
        const error = new Error('Credencials incorrectes');
        error.status = 401;
        throw error;
    }

    const accessToken = generarAccessToken(usuari);

    const refreshTokenString = await generarRefreshToken(usuari);

    const usuariSenseContrasenya = usuari.toObject();
    delete usuariSenseContrasenya.contrasenya;

    return { usuari: usuariSenseContrasenya, accessToken, refreshToken: refreshTokenString };
};

// Ejercicio 4.4 Refresh token (part de la lògica)
const rotarRefreshToken = async (usuari, oldToken) => {
    usuari.refreshTokens = usuari.refreshTokens.filter(t => t.token !== oldToken);

    const newToken = await generarRefreshToken(usuari);

    return newToken;
};

// Ejercicio 4.5 Logout
const logoutUsuari = async (usuari, token) => {
    usuari.refreshTokens = usuari.refreshTokens.filter(t => t.token !== token);
    await usuari.save();
};

const findUsuariByRefreshToken = async (token) => {
    return Usuari.findOne({
        'refreshTokens.token': token
    });
};

const getAllUsers = async () => {
    return await Usuari.find().select('-contrasenya -refreshTokens');
};

const updateUser = async (id, data) => {
    return await Usuari.findByIdAndUpdate(id, data, { new: true }).select('-contrasenya');
};

const deleteUser = async (id) => {
    return await Usuari.findByIdAndDelete(id);
};

module.exports = {
    registroUsuari,
    loginUsuari,
    generarAccessToken,
    generarRefreshToken,
    rotarRefreshToken,
    logoutUsuari,
    findUsuariByRefreshToken,
    getAllUsers,
    updateUser,
    deleteUser
};