# 📧 Configuración de Plantilla EmailJS para Mensajes de Contacto

## 🎯 Configuración Actual

Tu curriculum ahora enviará **automáticamente** todos los mensajes del formulario de contacto a: **bielrivero@gmail.com**

## ✅ Plantilla Actual en EmailJS

Ya tienes configurado:
- **Service ID**: `service_o2jjdf3`
- **Template ID**: `template_u11j9fj`
- **Email destino**: `bielrivero@gmail.com`

## 🔧 Cómo Configurar la Plantilla en EmailJS

### Paso 1: Acceder a tu Plantilla

1. Ve a [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Inicia sesión con tu cuenta
3. Ve a **Email Templates**
4. Busca la plantilla `template_u11j9fj` o crea una nueva

### Paso 2: Configurar la Plantilla

Edita tu plantilla con este contenido:

```
Para: {{user_email}}
De: {{from_email}}
Asunto: Nuevo mensaje de contacto - {{subject}}

{{message}}

---
Enviado el: {{timestamp}}
```

### Paso 3: Variables que debe incluir la plantilla

Asegúrate de que tu plantilla use estas variables (con dobles llaves):

- `{{user_email}}` - Tu email donde recibirás los mensajes (bielrivero@gmail.com)
- `{{from_name}}` - Nombre de quien envía el mensaje
- `{{from_email}}` - Email de quien envía el mensaje
- `{{subject}}` - Asunto del mensaje
- `{{message}}` - Contenido completo del mensaje
- `{{timestamp}}` - Fecha y hora del envío

### Paso 4: Verificar Servicio de Email

1. Ve a **Email Services** en EmailJS
2. Verifica que el servicio `service_o2jjdf3` esté conectado
3. Asegúrate de que el email asociado sea el correcto

## 🧪 Probar el Sistema

1. Abre tu curriculum: http://localhost:8081
2. Accede con tu email
3. Ve a la sección de Contacto
4. Completa el formulario:
   - **Nombre**: Prueba Test
   - **Email**: test@example.com
   - **Asunto**: Prueba de sistema
   - **Mensaje**: Este es un mensaje de prueba
5. Haz clic en "Enviar Mensaje"
6. Deberías ver:
   - ✅ Mensaje de éxito en la web
   - 📧 Email en tu bandeja de entrada (bielrivero@gmail.com)
   - 💬 Notificación en pantalla

## 📋 Ejemplo de Plantilla Mejorada (Opcional)

Para una mejor presentación, puedes usar este HTML en tu plantilla:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6366f1; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
        .label { font-weight: bold; color: #6366f1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📬 Nuevo Mensaje de Contacto</h2>
        </div>
        <div class="content">
            <p><span class="label">De:</span> {{from_name}}</p>
            <p><span class="label">Email:</span> {{from_email}}</p>
            <p><span class="label">Asunto:</span> {{subject}}</p>
            <hr>
            <p><span class="label">Mensaje:</span></p>
            <p>{{message}}</p>
        </div>
        <div class="footer">
            Enviado desde tu curriculum web el {{timestamp}}
        </div>
    </div>
</body>
</html>
```

## 🔍 Solución de Problemas

### ❌ Error 422: Unprocessable Entity

**Causa**: La plantilla no tiene las variables correctas
**Solución**: 
1. Revisa que las variables en la plantilla coincidan exactamente
2. Verifica que uses `{{}}` (dobles llaves) para las variables
3. Asegúrate de que el Template ID sea correcto

### ❌ Los mensajes no llegan

**Comprueba**:
1. ✅ El servicio de email está conectado en EmailJS
2. ✅ La plantilla está publicada (no en borrador)
3. ✅ Tu cuenta de EmailJS no ha superado el límite de 200 emails/mes
4. 🗂️ Revisa la carpeta de SPAM

### 📊 Ver mensajes enviados

1. Ve a EmailJS Dashboard
2. Sección **History**
3. Verás todos los emails enviados desde tu cuenta

## 🎨 Modo Desarrollo

Si quieres probar sin enviar emails reales, cambia en [config-email.js](config-email.js):

```javascript
devMode: true  // Solo muestra en consola, no envía emails
```

## 📱 Contacto de Respaldo

Si EmailJS falla, los mensajes se guardan localmente en el navegador. Puedes verlos en la consola con:

```javascript
localStorage.getItem('contact_messages')
```

---

**✅ Una vez configurada la plantilla, todos los mensajes del formulario se enviarán automáticamente a bielrivero@gmail.com**
