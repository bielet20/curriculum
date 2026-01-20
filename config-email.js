// ========================================
// CONFIGURACIÓN DE EMAIL - EmailJS
// ========================================

/*
 * Este archivo contiene la configuración para EmailJS.
 * Sigue estos pasos para configurarlo:
 * 
 * 1. Regístrate en https://www.emailjs.com/
 * 2. Crea un servicio de email (Gmail, Outlook, etc.)
 * 3. Crea una plantilla de email
 * 4. Obtén tu Public Key, Service ID y Template ID
 * 5. Reemplaza los valores abajo
 */

const EMAIL_CONFIG = {
    // Tu Public Key de EmailJS
    publicKey: '5Y4nBn7sGd1rIAXni',
    
    // ID de tu servicio de email
    serviceId: 'service_o2jjdf3',
    
    // ID de tu plantilla (usa el mismo para ambos por ahora)
    templateId: 'template_u11j9fj',
    
    // Email donde recibirás los mensajes
    toEmail: 'bielrivero@gmail.com'
};

// ========================================
// 📧 CONFIGURACIÓN RÁPIDA DE EMAILJS
// ========================================

/*
PASO 1: Crear cuenta en EmailJS
--------------------------------------
1. Ve a: https://www.emailjs.com/
2. Regístrate gratis (200 emails/mes)
3. Confirma tu email

PASO 2: Crear Servicio de Email
--------------------------------------
1. Dashboard → Email Services → Add New Service
2. Selecciona tu proveedor (Gmail recomendado)
3. Conecta tu cuenta de email
4. Copia el SERVICE ID (ej: service_abc123)

PASO 3: Crear Plantilla de Email
--------------------------------------
1. Dashboard → Email Templates → Create New Template
2. Usa este contenido:

---
Subject: 🔔 {{subject}}

{{message}}

---
De: {{from_name}} ({{from_email}})
Fecha: {{timestamp}}
---

3. Copia el TEMPLATE ID (ej: template_xyz789)

PASO 4: Obtener Public Key
--------------------------------------
1. Dashboard → Account → General
2. Copia tu Public Key (ej: xYz123AbC456)

PASO 5: Actualizar este archivo
--------------------------------------
Reemplaza arriba:
- publicKey: 'tu_public_key_aqui'
- serviceId: 'service_abc123'
- templateId: 'template_xyz789'
- toEmail: 'tu-email-real@gmail.com'

PASO 6: ¡Listo!
--------------------------------------
Recarga la página y prueba el formulario de contacto.
*/

// ========================================
// PLANTILLA SUGERIDA PARA EMAILJS
// ========================================

/*
Subject: Nuevo mensaje de {{from_name}} - {{subject}}

Hola,

Has recibido un nuevo mensaje desde tu curriculum web:

---
De: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}
---

Fecha: {{timestamp}}

---
Este mensaje fue enviado desde tu curriculum interactivo.
*/

// ========================================
// INTEGRACIÓN EN TU PROYECTO
// ========================================

/*
Para usar esta configuración:

1. Agrega el script de EmailJS en index.html antes de </body>:

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script src="config-email.js"></script>

2. Inicializa EmailJS en script.js:

(function(){
    emailjs.init(EMAIL_CONFIG.publicKey);
})();

3. Actualiza la función sendEmail en script.js:

async function sendEmail(data) {
    return emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        {
            from_name: data.nombre,
            from_email: data.email,
            subject: data.asunto,
            message: data.mensaje,
            to_email: EMAIL_CONFIG.toEmail,
            timestamp: new Date().toLocaleString('es-ES')
        }
    );
}
*/

// ========================================
// ALTERNATIVAS A EMAILJS
// ========================================

/*
OPCIÓN 1: FormSubmit.co (Sin JavaScript)
--------------------------------------
En index.html, cambia el form a:

<form action="https://formsubmit.co/tu-email@ejemplo.com" method="POST">
    <input type="hidden" name="_subject" value="Nuevo mensaje desde curriculum">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_next" value="https://tu-sitio.com/gracias.html">
    <!-- tus campos del formulario -->
</form>


OPCIÓN 2: Web3Forms (Gratis, 250 mensajes/mes)
--------------------------------------
1. Regístrate en https://web3forms.com/
2. Obtén tu Access Key

En index.html:
<form action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="TU_ACCESS_KEY">
    <!-- tus campos del formulario -->
</form>


OPCIÓN 3: Tu propio servidor Node.js con Nodemailer
--------------------------------------
server.js:

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu-email@gmail.com',
        pass: 'tu-password-de-aplicacion'
    }
});

app.post('/send-email', async (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;
    
    const mailOptions = {
        from: email,
        to: 'tu-email@gmail.com',
        subject: `Curriculum: ${asunto}`,
        html: `
            <h3>Nuevo mensaje de ${nombre}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));


OPCIÓN 4: Netlify Forms (Si usas Netlify)
--------------------------------------
En index.html:

<form name="contact" method="POST" data-netlify="true">
    <input type="hidden" name="form-name" value="contact">
    <!-- tus campos del formulario -->
</form>
*/

// ========================================
// EMAILS DE EJEMPLO
// ========================================

// Tus tres cuentas de correo electrónico
const MY_EMAILS = {
    personal: 'personal@ejemplo.com',
    profesional: 'profesional@ejemplo.com',
    empresarial: 'empresa@ejemplo.com'
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAIL_CONFIG, MY_EMAILS };
}
