const Usuari = require('../models/Usuari');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secretkey';

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';


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

const rotarRefreshToken = async (usuari, oldToken) => {
    usuari.refreshTokens = usuari.refreshTokens.filter(t => t.token !== oldToken);

    const newToken = await generarRefreshToken(usuari);

    return newToken;
};

const findUsuariByRefreshToken = async (token) => {
    return Usuari.findOne({
        'refreshTokens.token': token
    });
};

module.exports = {
    registroUsuari,
    loginUsuari,
    generarAccessToken,
    generarRefreshToken,
    rotarRefreshToken,
    findUsuariByRefreshToken
};