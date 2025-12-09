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
    enum: ['interior', 'exterior', 'suculentes', 'florals']
  },
imatge: {
  type: String,
  required: false,
  validate: {
    validator: function(v) {
      return /^((https?:\/\/.+)|\/img\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(v);
    },
    message: props => `${props.value} no és una URL o ruta d'imatge vàlida`
  }
}
,
  descripcio: {
    type: String,
    required: false,
    maxlength: 500
  }
});

module.exports = mongoose.model('Product', productSchema);
