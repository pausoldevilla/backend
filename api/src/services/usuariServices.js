const Usuari = require('../models/Usuari'); // Asegúrate de que la ruta sea correcta
const jwt = require('jsonwebtoken');

// 🔑 CORRECCIÓ: CLAU ÚNICA
// Simplificarem la lògica de les claus. Ja que el teu `authMiddleware.js`
// fa servir una clau per defecte si no es carrega l'entorn, farem que aquest
// servei també ho faci, però usant la mateixa lògica.
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; // 🚩 LA CLAU QUE FALLAVA 🚩
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secretkey'; 

const ACCESS_TOKEN_EXPIRATION = '15m'; 
const REFRESH_TOKEN_EXPIRATION = '7d'; 

// --- Funcions de Generació de Tokens ---

const generarAccessToken = (usuari) => {
    return jwt.sign(
        { id: usuari._id, email: usuari.email, rol: usuari.rol },
        JWT_SECRET, // Utilitzem la clau unificada JWT_SECRET
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );
};

const generarRefreshToken = async (usuari) => {
    const token = jwt.sign(
        { id: usuari._id },
        REFRESH_SECRET, // Utilitzem la clau REFRESH_SECRET
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );
    
    // Guardar el token a la base de dades
    usuari.refreshTokens.push({ token }); 
    await usuari.save(); 

    return token;
};

// --- Gestió de Usuaris (Sense Canvis) ---

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
    // 1. BUSCAR USUARIO Y FORZAR LA INCLUSIÓN DE LA CONTRASEÑA HASHEADA
    const usuari = await Usuari.findOne({ email }).select('+contrasenya'); 
    
    if (!usuari) {
        const error = new Error('Credencials incorrectes');
        error.status = 401;
        throw error;
    }
    
    // 2. VERIFICACIÓN DE INTEGRIDAD DEL HASH
    if (!usuari.contrasenya) {
        console.error(`Usuario ID ${usuari._id} encontrado, pero campo 'contrasenya' está vacío.`);
        const error = new Error('Error intern: La contrasenya de l\'usuari no està definida.');
        error.status = 500;
        throw error;
    }

    // 3. COMPARAR CONTRASEÑA PLANA con el HASH
    const esValid = await usuari.matchPassword(contrasenya);
    if (!esValid) {
        const error = new Error('Credencials incorrectes');
        error.status = 401;
        throw error;
    }

    // 4. GENERAR TOKENS
    const accessToken = generarAccessToken(usuari);
    // ⚠️ Nota: Si utilitzes un altre nom per al camp de Refresh Token a la resposta del login, 
    // assegura't que el frontend llegeixi el nom correcte. Per simplicitat, he canviat el nom 
    // de la variable de retorn a 'refreshTokenString' per evitar confusió d'objectes.
    const refreshTokenString = await generarRefreshToken(usuari);

    // Limpiar el objeto antes de devolverlo
    const usuariSenseContrasenya = usuari.toObject();
    delete usuariSenseContrasenya.contrasenya;

    return { usuari: usuariSenseContrasenya, accessToken, refreshToken: refreshTokenString };
};

const rotarRefreshToken = async (usuari, oldToken) => {
    // Elimina el token antic
    usuari.refreshTokens = usuari.refreshTokens.filter(t => t.token !== oldToken);
    
    // Genera i guarda el nou token
    const newToken = await generarRefreshToken(usuari);
    
    return newToken;
};

const findUsuariByRefreshToken = async (token) => {
    return Usuari.findOne({
        'refreshTokens.token': token
    });
};

// --- Exportacions ---

module.exports = {
    registroUsuari,
    loginUsuari,
    generarAccessToken,
    generarRefreshToken,
    rotarRefreshToken,
    findUsuariByRefreshToken
};