# 🎯 Curriculum Interactivo con Sistema de Seguridad

Una página web moderna y protegida para mostrar tu curriculum profesional con autenticación por contraseña que se renueva cada 24 horas.

## ✨ Características Principales

### 🔐 Sistema de Seguridad
- **Contraseña diaria automática**: Se genera una nueva contraseña cada día
- **Acceso controlado**: Solo personas autorizadas pueden ver tu curriculum
- **Notificaciones por email**: Recibes un correo cada vez que alguien solicita acceso
- **Log de accesos**: Registro completo de todos los intentos de acceso
- **Sesiones temporales**: Acceso válido por 24 horas

### 📧 Sistema de Contacto
- Formulario de contacto integrado
- Envío de emails mediante EmailJS
- Múltiples direcciones de correo electrónico
- Notificaciones en tiempo real

### 🎨 Diseño Moderno
- Interfaz limpia y profesional
- Totalmente responsive (móvil, tablet, desktop)
- Animaciones suaves
- Indicador de actividad en tiempo real
- Sistema de notificaciones

## 🚀 Inicio Rápido

### 1. Abrir la página

```bash
cd "/Applications/web curriculum proyecto"
python3 -m http.server 8000
```

Luego abre: http://localhost:8000

### 2. Obtener tu contraseña

Abre la consola del navegador (F12) y escribe:

```javascript
obtenerContraseñaHoy()
```

Esto te mostrará la contraseña del día actual (formato: 8 caracteres alfanuméricos).

### 3. Acceder

Ingresa la contraseña en el modal de login para acceder a tu curriculum.

## ⚙️ Configuración

### Configurar EmailJS (Importante para recibir notificaciones)

1. **Regístrate en EmailJS**: https://www.emailjs.com/
2. **Crea un servicio** de email (Gmail, Outlook, etc.)
3. **Crea una plantilla** de email
4. **Edita `config-email.js`** con tus credenciales:

```javascript
const EMAIL_CONFIG = {
    publicKey: 'tu_public_key',
    serviceId: 'service_xxx',
    templateId: 'template_xxx',
    toEmail: 'tu-email@gmail.com'
};
```

Ver [INSTRUCCIONES_SEGURIDAD.md](INSTRUCCIONES_SEGURIDAD.md) para más detalles.

### Personalizar Semilla Secreta

En `auth.js`, línea 14:

```javascript
const secretSeed = 'TU_FRASE_SECRETA_ÚNICA';
```

⚠️ **Importante**: No compartas esta semilla con nadie.

## 📋 Comandos de Administración

Abre la consola del navegador (F12) y usa estos comandos:

```javascript
// Ver todos los comandos disponibles
ayuda()

// Obtener contraseña de hoy
obtenerContraseñaHoy()

// Ver historial de accesos
verLogAccesos()

// Ver solicitudes pendientes
verSolicitudes()

// Ver información de tu sesión
infoSesion()

// Ver estadísticas
estadisticas()

// Ver contraseñas de los próximos 7 días
verContraseñasFuturas(7)

// Limpiar datos
limpiarDatos('log')  // log, solicitudes, mensajes, sesion, todo
```

## 🔒 Cómo Funciona la Seguridad

### Generación de Contraseña

La contraseña se genera automáticamente usando:
- Fecha actual (día, mes, año)
- Semilla secreta personalizada
- Algoritmo de hash

**Ejemplo**: Si hoy es 20/01/2026 y tu semilla es "MiSecreto", la contraseña podría ser: `AB3X7K9Q`

### Ciclo de Vida

```
HOY (20 Enero)
├─ Contraseña: AB3X7K9Q
├─ Válida hasta: 21 Enero 00:00
└─ Al expirar → Nueva contraseña automática

MAÑANA (21 Enero)
├─ Contraseña: XK9Q2M7P (nueva)
├─ Válida hasta: 22 Enero 00:00
└─ ...
```

### Flujo de Acceso

1. **Usuario abre la página** → Ve modal de login
2. **Opción A**: Tiene contraseña → Accede directamente
3. **Opción B**: No tiene contraseña → Solicita acceso con email
4. **Recibes notificación** con datos del solicitante y contraseña actual
5. **Tú decides** si compartir la contraseña

## 📁 Estructura del Proyecto

```
/Applications/web curriculum proyecto/
├── index.html                      # Página principal
├── styles.css                      # Estilos y diseño
├── script.js                       # Funcionalidad general
├── auth.js                         # Sistema de autenticación ⭐
├── admin-panel.js                  # Panel de administración ⭐
├── config-email.js                 # Configuración de EmailJS
├── README_NUEVO.md                 # Esta guía
├── INSTRUCCIONES_SEGURIDAD.md      # Guía completa de seguridad ⭐
└── README.md                       # Readme original
```

## 🎨 Personalización

### Cambiar tu información

Edita `index.html`:

```html
<h1 class="hero-title">Tu Nombre Aquí</h1>
<p class="hero-subtitle">Desarrollador Web | Diseñador</p>
```

### Cambiar emails de contacto

En la sección de correos electrónicos:

```html
<a href="mailto:personal@ejemplo.com">personal@ejemplo.com</a>
```

### Cambiar colores

En `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --dark-color: #1e293b;
}
```

## 🛡️ Seguridad y Privacidad

### Nivel de Seguridad Actual

✅ **Implementado**:
- Contraseña diaria con renovación automática
- Sesiones con expiración (24 horas)
- Log de accesos completo
- Notificaciones por email
- Almacenamiento local encriptado (hash)

⚠️ **Limitaciones**:
- Frontend-only (almacenado en localStorage del navegador)
- No hay base de datos backend
- La semilla está en el código fuente

### Recomendaciones

1. **No subas tu semilla secreta a GitHub público**
2. **Cambia la semilla periódicamente** (cada mes)
3. **Revisa el log de accesos regularmente**
4. **Para producción**: Considera implementar un backend real

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets
- ✅ Responsive design

## 🆘 Solución de Problemas

### No recibo emails

1. Verifica la configuración en `config-email.js`
2. Revisa la consola del navegador (F12)
3. Verifica tu cuota en EmailJS (200 emails/mes gratis)

### No sé mi contraseña

```javascript
obtenerContraseñaHoy()  // En la consola (F12)
```

### Perdí el acceso

```javascript
localStorage.clear()  // Limpia todo
```

Luego recarga la página y obtén la contraseña nuevamente.

## 📧 Contacto y Soporte

Para obtener ayuda:

1. Lee [INSTRUCCIONES_SEGURIDAD.md](INSTRUCCIONES_SEGURIDAD.md)
2. Revisa la consola del navegador (F12)
3. Usa `ayuda()` en la consola para ver comandos

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

---

**¡Disfruta de tu curriculum protegido! 🎉**

Para más información detallada, consulta [INSTRUCCIONES_SEGURIDAD.md](INSTRUCCIONES_SEGURIDAD.md)
