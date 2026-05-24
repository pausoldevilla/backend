const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const products = [
  {
    nom: 'Ficus Robusta',
    descripcio: 'Planta d\'interior molt resistent i elegant amb fulles grans.',
    preu: 19.99,
    stock: 50,
    categoria: 'interior',
    imatge: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400'
  },
  {
    nom: 'Roser vermell',
    descripcio: 'Planta d\'exterior ideal per a balcons i jardins.',
    preu: 49.99,
    stock: 30,
    categoria: 'exterior',
    imatge: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'
  },
  {
    nom: 'Echeveria Elegans',
    descripcio: 'Planta suculenta preciosa en forma de roseta.',
    preu: 9.99,
    stock: 100,
    categoria: 'suculentas',
    imatge: 'https://images.unsplash.com/photo-1520302817085-0613dc25a2df?w=400'
  },
  {
    nom: 'Orquídia Phalaenopsis',
    descripcio: 'Planta floral d\'interior amb flors espectaculars.',
    preu: 24.99,
    stock: 15,
    categoria: 'florales',
    imatge: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400'
  },
  {
    nom: 'Aloe Vera',
    descripcio: 'Planta suculenta amb múltiples propietats beneficioses.',
    preu: 14.99,
    stock: 40,
    categoria: 'suculentas',
    imatge: 'https://images.unsplash.com/photo-1596547613755-912f68361153?w=400'
  },
  {
    nom: 'Monstera Deliciosa',
    descripcio: 'Planta d\'interior clàssica i molt popular.',
    preu: 29.99,
    stock: 25,
    categoria: 'interior',
    imatge: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connectat a MongoDB');

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Ja hi ha ${count} productes. No es sobreescriuen.`);
      process.exit(0);
    }

    await Product.insertMany(products);
    console.log(`✅ ${products.length} productes inserits correctament!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();
