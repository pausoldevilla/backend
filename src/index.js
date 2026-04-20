require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const usuariRoutes = require('./routes/usuariRoutes');
const contactRoutes = require('./routes/contactRoutes');
const comandaRoutes = require('./routes/comandaRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const corsOptions = {
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// El webhook de Stripe necessita el "raw body" per verificar la signatura
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/products', productRoutes);
app.use('/api/usuari', usuariRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/comandes', comandaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);


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