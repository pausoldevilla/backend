require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes'); // 👈 Importem les rutes

const app = express();

// Middleware per parsejar JSON
app.use(express.json());

// Connexió a la base de dades
connectDB();

// Ruta principal per comprovar que l’API funciona
app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

// 👇 Registrem les rutes de productes sota el prefix /api/products
app.use('/api/products', productRoutes);

// Port del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
