const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  }
}, {
  timestamps: true
});

// Índex únic per email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
