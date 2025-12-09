require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 1. Importar CORS

const productRoutes = require('./routes/productRoutes');
const usuariRoutes = require('./routes/usuariRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ CONFIGURACIÓN CORS ⚠️
// ----------------------------------------------------
// Asume que tu frontend React se ejecuta en http://localhost:5173 (puerto común de Vite)
const CLIENT_URL = 'http://localhost:5173'; 

const corsOptions = {
  // Define el origen permitido (tu aplicación React)
  origin: CLIENT_URL,
  
  // Define los métodos permitidos (crucial incluir OPTIONS y POST)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  
  // Define las cabeceras permitidas (crucial para Content-Type y Authorization)
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  credentials: true,
};

// 2. Usar el middleware CORS ANTES de las rutas
app.use(cors(corsOptions)); 
// ----------------------------------------------------

// Middleware para parsear JSON en las peticiones
app.use(express.json()); 

// Definición de Rutas
app.use('/api/products', productRoutes);
app.use('/api/usuari', usuariRoutes);

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