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

usuariSchema.methods.matchPassword = function(passwordPlana) {
  return bcrypt.compare(passwordPlana, this.contrasenya);
};

module.exports = mongoose.model('Usuari', usuariSchema);
