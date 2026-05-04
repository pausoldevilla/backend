const mongoose = require('mongoose');

const comandaSchema = new mongoose.Schema({
    usuari: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuari',
        required: true
    },
    productes: [
        {
            producte: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            nom: { type: String, required: true },
            quantitat: { type: Number, required: true, min: 1 },
            preuUnitari: { type: Number, required: true, min: 0 },
            imatge: { type: String }
        }
    ],
    adreca: {
        nom: { type: String, required: true },
        carrer: { type: String, required: true },
        ciutat: { type: String, required: true },
        codiPostal: { type: String, required: true },
        pais: { type: String, default: 'España' }
    },
    metodePagament: {
        type: String,
        enum: ['targeta', 'transferencia'],
        required: false
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estat: {
        type: String,
        enum: ['pendent_pagament', 'pendent', 'pagat', 'procesant', 'enviat', 'completat', 'cancelat'],
        default: 'pendent_pagament'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comanda', comandaSchema);
