# 📧 Sistema de Acceso por Email - Enlaces Mágicos

## 🎯 ¿Cómo funciona?

Este curriculum utiliza un sistema de **autenticación por enlaces mágicos** (magic links). Los usuarios no necesitan recordar contraseñas.

### Flujo de Acceso

1. **Usuario visita la página** → Ve pantalla de solicitud de acceso
2. **Introduce su email** → Click en "Solicitar Acceso"
3. **Recibe email con enlace** → Enlace mágico válido por 24 horas
4. **Click en el enlace** → Acceso automático al curriculum
5. **Sesión activa** → 24 horas de acceso desde el primer click

## 🔐 Seguridad

- **Tokens únicos**: Cada solicitud genera un token único
- **Expiración automática**: Los enlaces expiran después de 24 horas
- **Validación de hash**: Los tokens incluyen firma criptográfica simple
- **Sin contraseñas**: No hay contraseñas que puedan ser robadas o compartidas
- **Trazabilidad**: Todas las solicitudes se registran localmente

## ⚙️ Configuración

### 1. Configurar EmailJS (Recomendado)

**Opción A: EmailJS (Gratis hasta 200 emails/mes)**

1. Crea cuenta en [EmailJS](https://www.emailjs.com/)

2. Crea un servicio de email (Gmail, Outlook, etc.)

3. Crea un template con estas variables:
   ```
   Para: {{to_email}}
   Asunto: Tu enlace de acceso al curriculum - Válido 24 horas
   
   Mensaje:
   Hola,
   
   Has solicitado acceso a mi curriculum privado.
   
   Haz clic en el siguiente enlace para acceder:
   {{magic_link}}
   
   Este enlace es válido por 24 horas.
   Fecha de solicitud: {{request_date}}
   
   Si no solicitaste este acceso, ignora este email.
   
   Saludos,
   Gabriel Rivero Sampol
   ```

4. Edita `config-email.js`:
   ```javascript
   const EMAIL_CONFIG = {
       publicKey: 'TU_PUBLIC_KEY',
       serviceId: 'TU_SERVICE_ID',
       templateId: 'TU_TEMPLATE_ID',
       magicLinkTemplateId: 'TU_MAGIC_LINK_TEMPLATE_ID',
       toEmail: 'bielrivero@gmail.com'
   };
   ```

5. Añade el script de EmailJS en `index-protegido.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script src="config-email.js"></script>
   ```

### 2. Configurar Email del Propietario

En `script.js`, línea 8:
```javascript
const AUTH_CONFIG = {
    ownerEmail: 'bielrivero@gmail.com', // ← Cambia esto
    tokenDuration: 24 * 60 * 60 * 1000,
    sessionKey: 'curriculum_auth_token',
    secretKey: 'curriculum_secret_2026_grs' // ← Cambia por algo único
};
```

### 3. Modo de Desarrollo (Sin EmailJS)

Si EmailJS no está configurado, el sistema:
- ✅ Genera el enlace mágico correctamente
- ✅ Muestra el enlace en la consola del navegador
- ✅ Simula el envío exitoso
- ⚠️ No envía emails reales

**Para ver el enlace en desarrollo:**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Consola"
3. Solicita acceso con cualquier email
4. Copia el enlace que aparece en la consola

## 📝 Formato del Token

Los tokens tienen este formato (Base64):
```
email|timestamp|hash
```

Ejemplo decodificado:
```
usuario@ejemplo.com|1737392400000|a3f5c2d
```

- **email**: Email del solicitante
- **timestamp**: Momento de generación (milisegundos)
- **hash**: Firma de seguridad

## 🔗 Ejemplo de Enlace Mágico

```
https://tucurriculum.com/index-protegido.html?token=dXN1YXJpb0BlamVtcGxvLmNvbXwxNzM3MzkyNDAwMDAwfGEzZjVjMmQ=
```

## 🧪 Pruebas en Local

### Sin EmailJS configurado:
```bash
1. Abre index-protegido.html en el navegador
2. Introduce cualquier email
3. Click en "Solicitar Acceso"
4. Abre la consola (F12)
5. Copia el enlace que aparece
6. Pega el enlace en la barra de direcciones
7. ¡Acceso concedido!
```

### Con EmailJS configurado:
```bash
1. Abre index-protegido.html en el navegador
2. Introduce tu email real
3. Click en "Solicitar Acceso"
4. Revisa tu bandeja de entrada
5. Click en el enlace del email
6. ¡Acceso concedido!
```

## 📊 Monitorización

### Ver solicitudes de acceso:
```javascript
// En la consola del navegador
localStorage.getItem('access_requests')
```

### Ver sesión activa:
```javascript
localStorage.getItem('curriculum_auth_token')
```

### Limpiar todo:
```javascript
localStorage.clear()
```

## 🚀 Deployment en Producción

### Con Coolify

1. **Configura EmailJS** antes de desplegar

2. **Variables de entorno** en Coolify:
   ```
   EMAILJS_PUBLIC_KEY=tu_public_key
   EMAILJS_SERVICE_ID=tu_service_id
   EMAILJS_TEMPLATE_ID=tu_template_id
   ```

3. **Dominio personalizado**:
   - El enlace mágico usará automáticamente tu dominio
   - Ejemplo: `https://gabrielrivero.com?token=xxx`

4. **SSL automático** con Let's Encrypt

### Con Docker

El `Dockerfile` y `docker-compose.yml` existentes funcionan perfectamente:

```bash
docker-compose up -d
```

Accede en: `http://localhost:8080`

## ⚠️ Consideraciones Importantes

1. **Emails en Spam**: Los enlaces mágicos pueden ir a spam. Recomienda revisar la carpeta de spam.

2. **Límites de EmailJS**: 
   - Plan gratuito: 200 emails/mes
   - Si necesitas más, considera plan de pago o alternativas

3. **Seguridad del Token**:
   - Cambia `AUTH_CONFIG.secretKey` por algo único
   - No compartas los enlaces mágicos públicamente
   - Los enlaces expiran automáticamente

4. **Persistencia**:
   - La sesión se guarda en `localStorage`
   - Si el usuario borra datos del navegador, pierde acceso
   - Puede solicitar nuevo enlace en cualquier momento

## 🔧 Personalización

### Cambiar duración del token:

```javascript
tokenDuration: 12 * 60 * 60 * 1000, // 12 horas
tokenDuration: 48 * 60 * 60 * 1000, // 48 horas
tokenDuration: 7 * 24 * 60 * 60 * 1000, // 7 días
```

### Personalizar mensaje del email:

Edita el template en EmailJS o modifica la función `sendMagicLinkEmail()` en `script.js`.

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica configuración de EmailJS
3. Comprueba que el email no esté en spam
4. Contacta a: bielrivero@gmail.com

---

✨ **¡Sistema de autenticación moderno y seguro sin contraseñas!**
