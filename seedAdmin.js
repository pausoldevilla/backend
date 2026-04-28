const mongoose = require('mongoose');
const Usuari = require('./src/models/Usuari');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connectat a MongoDB');

        const adminExists = await Usuari.findOne({ email: 'admin@soldevilla.com' });
        if (adminExists) {
            console.log('L\'usuari admin ja existeix.');
            process.exit(0);
        }

        const admin = new Usuari({
            nom: 'Administrador',
            titol: 'Sr.',
            email: 'admin@soldevilla.com',
            contrasenya: 'admin1234', // Es xifrarà automàticament pel middleware 'pre-save'
            rol: 'admin',
            adreca: {
                carrer: 'Carrer Principal 1',
                ciutat: 'Barcelona',
                codiPostal: '08001',
                pais: 'Espanya'
            }
        });

        await admin.save();
        console.log('Usuari administrador creat correctament:');
        console.log('Email: admin@soldevilla.com');
        console.log('Password: admin1234');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creant l\'admin:', error);
        process.exit(1);
    }
};

seedAdmin();
