# 🔐 Sistema de Seguridad para tu Curriculum

## ✅ ¿Qué se ha implementado?

Tu página de curriculum ahora cuenta con un **sistema de autenticación seguro** que incluye:

### 1. **Contraseña Diaria Automática**
- Se genera automáticamente una contraseña única cada día
- La contraseña expira a las 00:00 horas y se renueva
- Basada en un algoritmo que combina la fecha actual con una semilla secreta

### 2. **Control de Acceso**
- Al abrir la página, aparece un modal de login
- Solo con la contraseña correcta se puede ver el contenido
- Las sesiones son válidas por 24 horas

### 3. **Sistema de Solicitudes**
- Los visitantes pueden solicitar acceso ingresando su nombre y email
- Recibes automáticamente un correo con:
  - Nombre y email del solicitante
  - Fecha y hora de la solicitud
  - La contraseña actual del día (para compartir si lo deseas)

### 4. **Notificaciones por Email**
- Cada vez que alguien intenta acceder, recibes un email
- El email incluye la contraseña del día por si quieres compartirla
- Todas las solicitudes quedan registradas

---

## 🚀 Cómo Usar el Sistema

### **Obtener tu Contraseña Diaria:**

1. Abre la consola del navegador (F12)
2. Escribe: `auth.getTodayPassword()`
3. Te mostrará la contraseña del día (8 caracteres alfanuméricos)

**Ejemplo:**
```javascript
auth.getTodayPassword()
// Retorna: "AB3X7K9Q"
```

### **Ver el Log de Accesos:**

```javascript
// Ver todos los intentos de acceso
JSON.parse(localStorage.getItem('access_log'))

// Ver solicitudes de acceso pendientes
JSON.parse(localStorage.getItem('access_requests'))
```

### **Verificar Tiempo Restante de Sesión:**

```javascript
auth.getSessionTimeRemaining()
// Retorna: { hours: 23, minutes: 45, milliseconds: 85500000 }
```

### **Cerrar Sesión:**

- Haz clic en el botón "Cerrar Sesión" en la esquina superior derecha
- O usa: `auth.logout()`

---

## ⚙️ Configuración Necesaria

### **Paso 1: Configurar EmailJS (Para recibir notificaciones)**

1. **Regístrate en EmailJS:**
   - Ve a: https://www.emailjs.com/
   - Crea una cuenta gratuita

2. **Crea un Servicio de Email:**
   - Dashboard → Add New Service
   - Selecciona Gmail, Outlook, o el que uses
   - Conecta tu cuenta

3. **Crea una Plantilla:**
   - Dashboard → Email Templates → Create New Template
   - Usa este contenido:

```
Subject: 🔔 Solicitud de Acceso a tu Curriculum

Hola,

{{from_name}} ({{from_email}}) ha solicitado acceso a tu curriculum.

{{message}}

---
Fecha: {{timestamp}}
```

4. **Obtén tus Credenciales:**
   - Public Key: Account → General
   - Service ID: En tu servicio creado
   - Template ID: En tu plantilla creada

5. **Edita `config-email.js`:**

```javascript
const EMAIL_CONFIG = {
    publicKey: 'tu_public_key_real',
    serviceId: 'service_xxx',
    templateId: 'template_xxx',
    toEmail: 'tu-email@gmail.com'  // Tu email real
};
```

### **Paso 2: Personalizar la Semilla Secreta**

En `auth.js`, línea 14, cambia:

```javascript
const secretSeed = 'MI_CLAVE_SECRETA_PERSONAL_2026';
```

Por algo único y personal (no lo compartas):

```javascript
const secretSeed = 'MiNombreCompleto_FechaNacimiento_LugarFavorito';
```

**⚠️ IMPORTANTE:** Nunca subas este archivo a GitHub si está en público.

### **Paso 3: Personalizar tu Email de Admin**

En `auth.js`, línea 8:

```javascript
this.adminEmail = 'tu-email@ejemplo.com';
```

Cámbialo por tu email real.

---

## 🎯 Cómo Funciona

### **Flujo de Acceso Normal:**

```
1. Usuario abre la página
   ↓
2. Ve el modal de login
   ↓
3. Tiene 2 opciones:
   
   OPCIÓN A: Tiene la contraseña
   - Ingresa la contraseña
   - Accede al contenido
   - Sesión válida por 24 horas
   
   OPCIÓN B: No tiene la contraseña
   - Ingresa su nombre y email
   - Hace clic en "Solicitar"
   - TÚ recibes un email con:
     * Datos del solicitante
     * Contraseña actual del día
   - Tú decides si compartir la contraseña
```

### **Flujo de Contraseña:**

```
HOY (20 Enero 2026)
Contraseña: AB3X7K9Q
Válida hasta: 21 Enero 00:00

MAÑANA (21 Enero 2026)
Contraseña: XK9Q2M7P (nueva automática)
Válida hasta: 22 Enero 00:00
```

---

## 📧 Ejemplos de Email que Recibirás

### **Cuando alguien solicita acceso:**

```
De: EmailJS Notifications
Para: tu-email@gmail.com
Asunto: 🔔 Solicitud de acceso a tu Curriculum

---
Juan Pérez (juan.perez@empresa.com) ha intentado acceder a tu curriculum.

Fecha y hora: 20/1/2026 14:30:25

Si deseas compartir el acceso, la contraseña de hoy es: AB3X7K9Q

Esta contraseña expira en: 9 horas y 30 minutos
---
```

---

## 🛡️ Seguridad

### **¿Qué tan seguro es?**

- ✅ **Contraseña diaria:** Se renueva automáticamente
- ✅ **Sesiones con expiración:** 24 horas máximo
- ✅ **Log de accesos:** Registro de todos los intentos
- ✅ **Notificaciones:** Recibes email de cada solicitud
- ⚠️ **Limitación:** Frontend-only (almacenado en localStorage)

### **Recomendaciones:**

1. **No compartas la semilla secreta** (`secretSeed`)
2. **Cambia la semilla periódicamente** (cada mes)
3. **Revisa el log de accesos regularmente**
4. **Para máxima seguridad:** Implementa un backend real

---

## 🔧 Comandos Útiles

```javascript
// Ver contraseña de hoy (solo si estás logueado)
auth.getTodayPassword()

// Ver tiempo restante de sesión
auth.getSessionTimeRemaining()

// Cerrar sesión
auth.logout()

// Ver log de accesos
JSON.parse(localStorage.getItem('access_log'))

// Ver solicitudes pendientes
JSON.parse(localStorage.getItem('access_requests'))

// Limpiar todo el registro
localStorage.clear()
```

---

## 📱 Uso Móvil

El sistema funciona perfectamente en dispositivos móviles:
- Modal responsive
- Teclados virtuales compatibles
- Notificaciones adaptadas

---

## 🆘 Solución de Problemas

### **No recibo emails:**

1. Verifica que EmailJS esté configurado en `config-email.js`
2. Revisa la consola del navegador (F12) para errores
3. Verifica tu cuota en EmailJS (200 emails/mes gratis)

### **No sé cuál es mi contraseña:**

1. Abre la consola (F12)
2. Escribe: `auth.getTodayPassword()`
3. Si dice `null`, haz login primero

### **Perdí acceso:**

1. Limpia localStorage: `localStorage.clear()`
2. Recarga la página
3. Obtén la contraseña nuevamente

### **Quiero desactivar la seguridad temporalmente:**

En `auth.js`, comenta la verificación al final:

```javascript
// window.addEventListener('DOMContentLoaded', () => {
//     if (!auth.isAuthenticated()) {
//         ...
//     }
// });
```

---

## 📊 Panel de Admin (Futuro)

Puedes crear una página de admin para ver:
- Estadísticas de acceso
- Solicitudes pendientes
- Generar contraseñas personalizadas
- Whitelist de emails autorizados

---

## 🎨 Personalización

### **Cambiar colores del modal:**

En `styles.css`, busca `.auth-modal`:

```css
.auth-modal {
    background: linear-gradient(135deg, #tu-color-1, #tu-color-2);
}
```

### **Cambiar tiempo de expiración:**

En `auth.js`, línea 53:

```javascript
const twentyFourHours = 24 * 60 * 60 * 1000; // Cambia 24 por las horas que quieras
```

---

## ✉️ Contacto y Soporte

Si tienes dudas o necesitas ayuda con la configuración, puedes:
1. Revisar la consola del navegador para mensajes de depuración
2. Verificar los logs: `console.log(localStorage.getItem('access_log'))`
3. Probar el sistema con diferentes escenarios

---

**¡Tu curriculum ahora está protegido y recibirás notificaciones de cada acceso! 🎉**
