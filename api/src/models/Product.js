const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom és obligatori'],
    minlength: 2
  },
  preu: {
    type: Number,
    required: [true, 'El preu és obligatori'],
    min: 0
  },
  categoria: {
    type: String,
    required: [true, 'La categoria és obligatòria'],
    enum: ['plantas', 'macetas', 'herramientas', 'decoracion', 'semillas']
  },
  imatge: {
    type: String, // URL o ruta de la imagen
    required: false, // opcional
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: props => `${props.value} no és una URL d'imatge vàlida`
    }
  },
  descripcio: {
    type: String,
    required: false,
    maxlength: 500 // límite para evitar textos demasiado largos
  }
});

module.exports = mongoose.model('Product', productSchema);
