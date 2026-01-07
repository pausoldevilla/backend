const contactService = require('../services/contactService');

const sendEmail = async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    const destinatario = 'info.soldevilla@gmail.com';

    try {
        await contactService.sendContactEmail(nombre, email, mensaje, destinatario);

        return res.status(200).json({
            status: 'success',
            message: 'Correo enviado correctamente'
        });

    } catch (error) {
        console.error('Error en el controlador de contacto:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Fallo en el envío del correo'
        });
    }
};

module.exports = {
    sendEmail,
};