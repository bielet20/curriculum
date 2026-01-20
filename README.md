# Mi Curriculum Interactivo 📄

Una página web de curriculum profesional e interactivo con sistema de contacto y notificaciones en tiempo real.

## 🌟 Características

### ✨ Funcionalidades Principales

1. **Indicador de Actividad en Tiempo Real**
   - Muestra si estás "En línea" o "Ausente"
   - Detecta inactividad automáticamente después de 5 minutos
   - Notificaciones visuales del estado

2. **Formulario de Contacto Interactivo**
   - Campos validados para nombre, email, asunto y mensaje
   - Animaciones suaves al enviar
   - Respuestas visuales de éxito/error
   - Los mensajes se guardan localmente

3. **Tres Cuentas de Correo Electrónico**
   - Correo Personal
   - Correo Profesional
   - Correo Empresarial
   - Click para copiar al portapapeles

4. **Sistema de Notificaciones**
   - Notificaciones tipo toast en la esquina inferior derecha
   - 4 tipos: info, success, warning, error
   - Se auto-eliminan después de 5 segundos

5. **Diseño Completamente Responsive**
   - Adaptable a móviles, tablets y escritorio
   - Navegación suave entre secciones
   - Animaciones fluidas

## 🚀 Cómo Usar

### Instalación Básica

1. Abre el archivo `index.html` en tu navegador web
2. ¡Listo! La página funcionará localmente

### Personalización

#### 1. Editar tu Información Personal

En `index.html`, busca y modifica:

```html
<!-- Nombre y título -->
<h1 class="hero-title">Tu Nombre Aquí</h1>
<p class="hero-subtitle">Desarrollador Web | Diseñador | Profesional</p>

<!-- Foto de perfil -->
<img src="https://via.placeholder.com/200" alt="Foto de perfil">
<!-- Cambia la URL por tu foto real -->

<!-- Sobre ti -->
<p class="about-text">
    Tu descripción profesional aquí...
</p>
```

#### 2. Configurar tus Correos Electrónicos

Busca esta sección en `index.html` y reemplaza los emails:

```html
<a href="mailto:personal@ejemplo.com">personal@ejemplo.com</a>
<a href="mailto:profesional@ejemplo.com">profesional@ejemplo.com</a>
<a href="mailto:empresa@ejemplo.com">empresa@ejemplo.com</a>
```

#### 3. Agregar tu Experiencia

Edita las tarjetas de timeline:

```html
<h3>Puesto de Trabajo</h3>
<h4>Nombre de la Empresa</h4>
<p class="timeline-date">2022 - Presente</p>
<p>Descripción de tus responsabilidades...</p>
```

## 📧 Configurar Email Real (Opcional)

Para recibir emails reales de tu formulario de contacto, puedes usar uno de estos servicios:

### Opción 1: EmailJS (Recomendado - Gratis)

1. Regístrate en [EmailJS](https://www.emailjs.com/)
2. Crea un servicio de email
3. Crea una plantilla de email
4. Agrega este script antes de `</body>` en `index.html`:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
   (function(){
      emailjs.init("TU_PUBLIC_KEY"); // Reemplaza con tu Public Key
   })();
</script>
```

5. En `script.js`, descomenta y configura la función `sendEmail`:

```javascript
async function sendEmail(data) {
    return emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
        from_name: data.nombre,
        from_email: data.email,
        subject: data.asunto,
        message: data.mensaje,
        to_email: "tu-email@ejemplo.com" // Tu email donde recibirás los mensajes
    });
}
```

### Opción 2: FormSubmit.co (Más Simple)

1. En `index.html`, cambia la etiqueta `<form>`:

```html
<form class="contact-form" id="contactForm" 
      action="https://formsubmit.co/tu-email@ejemplo.com" 
      method="POST">
```

2. Agrega estos campos ocultos:

```html
<input type="hidden" name="_subject" value="Nuevo mensaje desde tu curriculum">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
```

### Opción 3: Tu Propio Backend

Si tienes un servidor backend, puedes modificar la función `sendEmail` en `script.js`:

```javascript
async function sendEmail(data) {
    const response = await fetch('https://tu-api.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Error al enviar');
    return response.json();
}
```

## 🎨 Personalizar Colores

En `styles.css`, modifica las variables CSS al inicio:

```css
:root {
    --primary-color: #6366f1;      /* Color principal */
    --secondary-color: #8b5cf6;    /* Color secundario */
    --dark-color: #1e293b;         /* Color oscuro */
    --light-color: #f8fafc;        /* Color claro */
    --text-color: #334155;         /* Color del texto */
    --success-color: #10b981;      /* Verde para éxito */
    --danger-color: #ef4444;       /* Rojo para error */
    --warning-color: #f59e0b;      /* Amarillo para advertencia */
}
```

## 📱 Funcionalidades Interactivas

### 1. Indicador de Actividad
- Cambia automáticamente a "Ausente" después de 5 minutos sin interacción
- Vuelve a "En línea" cuando detecta actividad

### 2. Notificaciones
- Aparecen automáticamente para eventos importantes
- Se pueden personalizar con diferentes tipos y mensajes

### 3. Formulario de Contacto
- Guarda todos los mensajes en `localStorage`
- Puedes ver los mensajes guardados en la consola del navegador (F12)
- Para ver mensajes: `console.log(localStorage.getItem('messages'))`

### 4. Copiar Email
- Click en cualquier email para copiarlo al portapapeles
- Notificación de confirmación

## 🔧 Estructura de Archivos

```
web curriculum proyecto/
│
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── script.js           # Funcionalidad interactiva
├── README.md           # Este archivo
└── config-email.js     # Configuración de email (opcional)
```

## 🌐 Publicar en Internet

### Opción 1: GitHub Pages (Gratis)
1. Crea un repositorio en GitHub
2. Sube estos archivos
3. Ve a Settings → Pages
4. Selecciona la rama main
5. Tu sitio estará en `https://tu-usuario.github.io/nombre-repo`

### Opción 2: Netlify (Gratis)
1. Arrastra la carpeta a [Netlify Drop](https://app.netlify.com/drop)
2. Obtendrás una URL instantánea

### Opción 3: Vercel (Gratis)
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta `vercel` en la carpeta
3. Sigue las instrucciones

## 📊 Ver Estadísticas

Abre la consola del navegador (F12) y escribe:

```javascript
// Ver todos los mensajes recibidos
JSON.parse(localStorage.getItem('messages'))

// Ver número de visitas
localStorage.getItem('visits')

// Ver última visita
localStorage.getItem('lastVisit')
```

## 🎯 Próximas Mejoras (Opcional)

- [ ] Panel de administración para ver mensajes
- [ ] Integración con base de datos
- [ ] Sistema de autenticación
- [ ] Chat en vivo
- [ ] Modo oscuro/claro
- [ ] Múltiples idiomas
- [ ] Descarga de CV en PDF

## 💡 Consejos

1. **Cambia la imagen de perfil**: Usa tu foto real en lugar del placeholder
2. **Personaliza las redes sociales**: Agrega tus enlaces de LinkedIn, GitHub, Twitter
3. **Agrega proyectos**: Crea una nueva sección para mostrar tu portafolio
4. **SEO**: Agrega meta tags en el `<head>` para mejorar el posicionamiento
5. **Analytics**: Integra Google Analytics para ver estadísticas de visitas

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos estén en la misma carpeta
3. Asegúrate de tener conexión a internet (para iconos de Font Awesome)

## 📝 Licencia

Uso libre para proyectos personales y comerciales.

---

¡Creado con ❤️ para impulsar tu carrera profesional!
