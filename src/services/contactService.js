const nodemailer = require('nodemailer'); 

const DARK_RED = '#8B0000';
const DARK = '#000000'; 
const LIGHT_GRAY = '#f7f7f7'; 
const BORDER_COLOR = '#f0f0f0'; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendContactEmail = async (nombre, email, mensaje, destinatario) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario, 
    subject: `[Contacto Web] Nuevo mensaje de ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: ${LIGHT_GRAY}; padding: 20px;">
        
        <div style="text-align: center; padding: 20px 0; background-color: #ffffff; border-bottom: 3px solid ${DARK}; margin-bottom: 20px;">
          <a href="#" style="text-decoration: none; color: #333;">
            <h1 style="font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0; color: ${DARK}; text-transform: uppercase; letter-spacing: 2px;">
              soldevilla
            </h1>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Notificación de Contacto</p>
          </a>
        </div>

        <div style="background-color: #ffffff; padding: 30px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); border: 1px solid ${BORDER_COLOR};">
          
          <h2 style="color: ${DARK}; font-size: 22px; margin-top: 0;">Nuevo Mensaje de Contacto Web</h2>
          <p style="font-size: 16px;">Has recibido un mensaje a través del formulario de contacto:</p>
          
          <div style="background-color: #fcfcfc; padding: 20px; margin-top: 20px; border: 1px solid ${BORDER_COLOR};">
            <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="margin: 0 0 10px 0;"><strong>Correo Electrónico:</strong> <a href="mailto:${email}" style="color: ${DARK_RED}; text-decoration: none;">${email}</a></p>
            <p style="margin: 0 0 5px 0;"><strong>Mensaje:</strong></p>
            <div style="white-space: pre-line; padding: 10px; background-color: ${LIGHT_GRAY}; font-style: italic;">
              ${mensaje}
            </div>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #555;">
            Para responder, haz clic en el correo electrónico del cliente o usa la función de respuesta de tu cliente de correo.
          </p>

        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          Este es un mensaje automático de notificación del formulario de contacto de soldevilla.
        </div>

      </div>
    `, 
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactEmail,
};