# 🔒 Curriculum Interactivo con Protección por Contraseña

Una página web de curriculum profesional e interactivo con **sistema de autenticación por contraseña** para mantener tu información privada.

## 🛡️ Sistema de Seguridad

### Características de Protección

✅ **Autenticación por Contraseña**
- Pantalla de login elegante antes de acceder al contenido
- Contraseña personalizable
- Botón para mostrar/ocultar contraseña

✅ **Sesión Persistente**
- La sesión se guarda por 24 horas después del login
- No necesitas volver a introducir la contraseña durante este tiempo
- Se guarda de forma segura en el navegador

✅ **Cierre de Sesión**
- Botón visible para cerrar sesión en cualquier momento
- Limpia automáticamente la sesión del navegador

## 🚀 Inicio Rápido

### 1. Abrir la Página Protegida

Abre el archivo `index-protegido.html` en tu navegador:

```bash
open "index-protegido.html"
```

### 2. Primer Acceso

**Contraseña por defecto:** `curriculum2026`

1. Ingresa la contraseña en la pantalla de login
2. Haz clic en "Acceder"
3. ¡Listo! Tendrás acceso al curriculum completo

### 3. Cambiar la Contraseña

Para personalizar tu contraseña, edita el archivo `script.js`:

```javascript
// Busca esta sección en script.js:
const AUTH_CONFIG = {
    // Cambia esta línea por tu contraseña personalizada
    password: 'curriculum2026',  // ← CAMBIA ESTO
    
    // Duración de la sesión (24 horas por defecto)
    sessionDuration: 24,
    
    sessionKey: 'curriculum_auth_session'
};
```

**Ejemplos de contraseñas seguras:**
- `MiCV_Seguro2026!`
- `Curriculum#Private2026`
- `AccessOnly_2026$`

## ⚙️ Configuración Avanzada

### Cambiar Duración de la Sesión

Por defecto, la sesión dura **24 horas**. Para cambiarla:

```javascript
const AUTH_CONFIG = {
    password: 'tu_contraseña',
    sessionDuration: 12,  // 12 horas
    // O
    sessionDuration: 48,  // 48 horas (2 días)
    sessionKey: 'curriculum_auth_session'
};
```

### Cerrar Todas las Sesiones

Si quieres forzar que todos vuelvan a hacer login:

1. Abre la consola del navegador (F12)
2. Escribe:
```javascript
localStorage.removeItem('curriculum_auth_session');
location.reload();
```

## 📁 Archivos del Sistema

### Archivos Principales

- **`index-protegido.html`** - Página con protección por contraseña ✅
- **`index.html`** - Página original sin protección
- **`script.js`** - Lógica de autenticación y funcionalidades
- **`styles.css`** - Estilos del curriculum
- **`styles-auth.css`** - Estilos de la pantalla de login

### Estructura de Seguridad

```
Sistema de Autenticación
│
├── Pantalla de Login (index-protegido.html)
│   ├── Campo de contraseña
│   ├── Botón mostrar/ocultar
│   └── Mensajes de error/éxito
│
├── Validación (script.js)
│   ├── Verificar contraseña
│   ├── Crear sesión
│   └── Validar sesión existente
│
└── Protección del Contenido
    ├── Ocultar contenido sin login
    ├── Mostrar contenido con login válido
    └── Botón de cerrar sesión
```

## 🎨 Personalización del Curriculum

Una vez dentro, personaliza estos elementos en `index-protegido.html`:

### 1. Información Personal

```html
<!-- Busca esta sección: -->
<h1 class="hero-title">Tu Nombre Aquí</h1>
<p class="hero-subtitle">Desarrollador Web | Diseñador | Profesional</p>
```

### 2. Foto de Perfil

```html
<img src="https://via.placeholder.com/200" alt="Foto de perfil">
<!-- Reemplaza la URL con tu foto real -->
```

### 3. Tus Correos Electrónicos

```html
<a href="mailto:personal@ejemplo.com">personal@ejemplo.com</a>
<a href="mailto:profesional@ejemplo.com">profesional@ejemplo.com</a>
<a href="mailto:empresa@ejemplo.com">empresa@ejemplo.com</a>
```

### 4. Experiencia y Habilidades

Edita las secciones correspondientes en el HTML con tu información real.

## 🔐 Seguridad - Preguntas Frecuentes

### ¿Es segura la contraseña?

⚠️ **Importante:** Este sistema es una **protección básica** adecuada para:
- Portfolios personales
- CV que quieres compartir solo con reclutadores
- Contenido semi-privado

**NO** es adecuado para:
- Información altamente confidencial
- Datos sensibles o personales críticos
- Aplicaciones empresariales

### ¿Puedo ver la contraseña en el código?

Sí, la contraseña está en el archivo `script.js` en texto plano. Esto significa que alguien con conocimientos técnicos podría encontrarla. Es una solución simple para protección básica.

### ¿Cómo hacer el sistema más seguro?

Para mayor seguridad, considera:

1. **Backend con base de datos**
2. **Autenticación con servicios externos** (Google, LinkedIn)
3. **Sistema de tokens JWT**
4. **Cifrado de contraseñas con hash**

## 📧 Sistema de Contacto

El formulario de contacto funciona **después del login**. Los visitantes autenticados pueden enviarte mensajes que se guardan localmente.

Para recibir emails reales, configura EmailJS siguiendo las instrucciones en `config-email.js`.

## 🌐 Publicar Tu Curriculum Protegido

### GitHub Pages

```bash
# 1. Crea un repositorio en GitHub
# 2. Sube los archivos
git init
git add .
git commit -m "Curriculum protegido"
git remote add origin https://github.com/tu-usuario/curriculum.git
git push -u origin main

# 3. Activa GitHub Pages en Settings
# Tu sitio estará en: https://tu-usuario.github.io/curriculum
```

### Netlify (Recomendado)

1. Arrastra la carpeta a [Netlify Drop](https://app.netlify.com/drop)
2. Obtendrás una URL instantánea
3. Comparte la URL solo con personas de confianza

### Vercel

```bash
npm i -g vercel
vercel
# Sigue las instrucciones
```

## 🎯 Uso Recomendado

### Para Compartir con Reclutadores

1. Publica tu curriculum protegido
2. Envía la URL + contraseña por email:

```
Asunto: Mi Curriculum - [Tu Nombre]

Hola,

Adjunto el enlace a mi curriculum interactivo:
🔗 https://tu-sitio.com

🔑 Contraseña: curriculum2026

Saludos,
[Tu Nombre]
```

### Para Mantener Privacidad

- Cambia la contraseña regularmente
- Usa contraseñas diferentes para distintos destinatarios
- Revisa los mensajes guardados en localStorage

## 🛠️ Solución de Problemas

### La contraseña no funciona

1. Verifica que no haya espacios al inicio o final
2. La contraseña distingue mayúsculas/minúsculas
3. Revisa que `script.js` tenga la contraseña correcta

### No puedo acceder después de cambiar la contraseña

1. Limpia la sesión: F12 → Console → `localStorage.clear()`
2. Recarga la página
3. Ingresa la nueva contraseña

### El contenido no se muestra después del login

1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que todos los archivos CSS y JS estén cargando

## 📊 Ver Estadísticas

Abre la consola (F12) y ejecuta:

```javascript
// Ver sesión actual
JSON.parse(localStorage.getItem('curriculum_auth_session'))

// Ver mensajes recibidos
JSON.parse(localStorage.getItem('messages'))

// Ver número de visitas
localStorage.getItem('visits')
```

## 🔄 Versiones

- **`index-protegido.html`** → Con protección por contraseña ✅
- **`index.html`** → Sin protección (versión original)

## 💡 Tips Profesionales

1. **Contraseña Única:** Usa una contraseña diferente para cada empresa/reclutador
2. **Seguimiento:** Anota a quién le compartiste cada contraseña
3. **Renovación:** Cambia la contraseña cada cierto tiempo
4. **Backup:** Guarda una copia de seguridad de tus archivos

## ⚡ Comandos Útiles

```bash
# Abrir en navegador (macOS)
open index-protegido.html

# Abrir en navegador (Windows)
start index-protegido.html

# Abrir en navegador (Linux)
xdg-open index-protegido.html

# Crear servidor local
python3 -m http.server 8000
# Luego visita: http://localhost:8000/index-protegido.html
```

## 📝 Licencia

Uso libre para proyectos personales y comerciales.

---

🔒 **Tu curriculum, tu privacidad, tu control.**

¿Preguntas? Revisa el código fuente o personaliza según tus necesidades.
