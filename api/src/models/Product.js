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
    enum: ['mobles', 'joies', 'art', 'roba']
  },

});

module.exports = mongoose.model('Product', productSchema);
