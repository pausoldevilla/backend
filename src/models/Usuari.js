const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const usuariSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    titol: {
        type: String,
        enum: ['Sr.', 'Sra.', 'Srta.'],
        required: false,
        default: 'Sr.'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Format d’email invàlid']
    },
    contrasenya: {
        type: String,
        required: true,
        minlength: 6
    },
    dataNaixement: {
        type: Date,
        required: false
    },
telefon: {
    type: String,
    required: false,
    trim: true,
    match: [/^\+\d{1,3}\s?\d{2,3}(\s?\d+)+$/, 'Format de telèfon invàlid']
},
    adreca: {
        carrer: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        ciutat: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        codiPostal: {
            type: String,
            trim: true,
            maxlength: 10,
        },
        pais: {
            type: String,
            trim: true,
            maxlength: 50,
            default: 'Espanya'
        }
    },
    rol: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    refreshTokens: [
        {
            token: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

usuariSchema.pre('save', async function (next) {
    if (!this.isModified('contrasenya')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.contrasenya = await bcrypt.hash(this.contrasenya, salt);
        next();
    } catch (err) {
        next(err);
    }
});

usuariSchema.methods.matchPassword = function (passwordPlana) {
    return bcrypt.compare(passwordPlana, this.contrasenya);
};

module.exports = mongoose.model('Usuari', usuariSchema);