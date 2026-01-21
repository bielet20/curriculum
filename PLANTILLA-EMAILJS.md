# 📧 Configuración de Plantillas EmailJS

## 🚨 IMPORTANTE: Dos Plantillas Diferentes

Tu curriculum necesita **DOS tipos de emails diferentes**:

1. **📬 Magic Links** - Para enviar enlaces de acceso a los usuarios
2. **💬 Mensajes de Contacto** - Para recibir mensajes del formulario

---

## 📬 PLANTILLA 1: Magic Links (Acceso al Curriculum)

### ¿Qué hace?
Envía un enlace de acceso temporal a las personas que solicitan ver tu curriculum.

### Configuración en EmailJS

**Paso 1:** Ve a tu dashboard de EmailJS → Email Templates

**Paso 2:** Crea o edita la plantilla `template_u11j9fj`

**Paso 3:** Configura estos campos:

**To Email:** `{{to_email}}`  
**Subject:** `Tu enlace de acceso al curriculum de Gabriel Rivero`

**Contenido del email:**

```
Hola {{user_name}},

Has solicitado acceso al curriculum privado de Gabriel Rivero Sampol.

Haz clic en el siguiente enlace para acceder:

{{link}}

⏱️ Este enlace es válido por 24 horas.
📅 Fecha de solicitud: {{timestamp}}

Si no solicitaste este acceso, puedes ignorar este email.

---
Gabriel Rivero Sampol
📧 bielrivero@gmail.com
📱 678 528 138
```

### Variables requeridas:
- `{{to_email}}` - Email destino (quien recibe el enlace)
- `{{user_name}}` - Nombre del usuario
- `{{link}}` - El enlace mágico de acceso
- `{{timestamp}}` - Fecha y hora de la solicitud
- `{{message}}` - Mensaje completo (opcional)

---

## 💬 PLANTILLA 2: Mensajes de Contacto

### ¿Qué hace?
Te envía a ti (bielrivero@gmail.com) los mensajes que te envían desde el formulario de contacto.

### Configuración

Puedes usar la misma plantilla o crear una nueva llamada `template_contacto`

**To Email:** `{{user_email}}`  
**Reply To:** `{{from_email}}`  
**Subject:** `Nuevo mensaje de contacto - {{subject}}`

**Contenido del email:**

```
📬 NUEVO MENSAJE DE CONTACTO

De: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Enviado desde tu curriculum web el {{timestamp}}
```

### Variables requeridas:
- `{{user_email}}` - Tu email (bielrivero@gmail.com)
- `{{from_name}}` - Nombre del remitente
- `{{from_email}}` - Email del remitente
- `{{subject}}` - Asunto del mensaje
- `{{message}}` - Contenido del mensaje
- `{{timestamp}}` - Fecha y hora

---

## ✅ Checklist de Configuración

### Para Magic Links:
- [ ] Plantilla creada en EmailJS
- [ ] Campo `To Email` configurado como `{{to_email}}`
- [ ] Variables `{{link}}`, `{{user_name}}`, `{{timestamp}}` en el contenido
- [ ] Template ID correcto en [config-email.js](config-email.js)
- [ ] Servicio de email conectado (Gmail, Outlook, etc.)

### Para Mensajes de Contacto:
- [ ] Plantilla creada (puede ser la misma)
- [ ] Campo `To Email` configurado como `{{user_email}}`
- [ ] Variables `{{from_name}}`, `{{from_email}}`, `{{message}}` en el contenido
- [ ] `contactTemplateId` configurado en [config-email.js](config-email.js)

---

## 🔧 Activar el Sistema

Una vez configuradas las plantillas:

1. Ve a [config-email.js](config-email.js)
2. Cambia `devMode: true` a `devMode: false`
3. Guarda el archivo
4. Reconstruye el contenedor:
   ```bash
   docker-compose down && docker-compose up -d --build
   ```

---

## 🧪 Probar el Sistema

### Probar Magic Links:
1. Ve a http://localhost:8081
2. Introduce un email de prueba
3. Revisa la consola del navegador (F12)
4. Si `devMode: true` → verás el enlace en consola
5. Si `devMode: false` → recibirás email real

### Probar Mensajes de Contacto:
1. Accede al curriculum
2. Ve a la sección "Contacto"
3. Envía un mensaje
4. Deberías recibir el email en bielrivero@gmail.com

---

## 🔍 Solución de Problemas

### ❌ Error 422: Unprocessable Entity

**Causa:** La plantilla no tiene las variables correctas o el email destino está mal configurado.

**Solución Magic Links:**
1. Verifica que el campo "To Email" sea `{{to_email}}` (NO `{{user_email}}`)
2. Asegúrate de que todas las variables tengan dobles llaves: `{{}}`
3. Revisa que el Template ID sea correcto

**Solución Contacto:**
1. El campo "To Email" debe ser `{{user_email}}` 
2. Verifica las variables `{{from_name}}`, `{{from_email}}`, `{{message}}`

### 📧 Los emails no llegan

1. Verifica en EmailJS Dashboard → History si se enviaron
2. Revisa la carpeta de SPAM
3. Confirma que el servicio de email esté conectado
4. Verifica que no hayas superado el límite (200 emails/mes gratis)

### 🔐 No puedo acceder aunque solicite el enlace

1. Abre la consola del navegador (F12)
2. El enlace siempre se muestra en consola aunque falle el email
3. Copia el enlace completo y pégalo en el navegador

---

## 📊 Ver Estado de Envíos

En la consola del navegador verás:
- ✅ Email enviado correctamente
- ❌ Error al enviar (con detalles)
- 🔑 Enlace mágico (siempre visible en desarrollo)

En EmailJS Dashboard:
- History → Ver todos los emails enviados
- Usage → Ver cuántos emails quedan

---

## 🎯 Configuración Actual

- **Service ID:** `service_o2jjdf3`
- **Template Magic Links:** `template_u11j9fj`
- **Template Contacto:** `template_u11j9fj` (misma plantilla por ahora)
- **Email destino:** `bielrivero@gmail.com`
- **Modo:** `devMode: true` (cambiar a `false` cuando esté configurado)
