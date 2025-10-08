require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connexió a MongoDB establerta');
    app.listen(PORT, () => {
      console.log(`Servidor escoltant al port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de connexió a MongoDB:', error.message);
  });
