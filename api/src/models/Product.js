const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  descripcio: {
    type: String,
    maxlength: 500
  },
  preu: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['mobles', 'joies', 'art', 'roba'],
    required: true
  },
  enEstoc: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índex per categoria per optimitzar cerques
productSchema.index({ categoria: 1 });

module.exports = mongoose.model('Product', productSchema);
