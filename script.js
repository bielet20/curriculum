// ========================================
// SISTEMA DE AUTENTICACIÓN POR EMAIL CON TOKEN TEMPORAL
// ========================================

// CONFIGURACIÓN DE SEGURIDAD
const AUTH_CONFIG = {
    // Email del propietario (donde llegarán las solicitudes)
    ownerEmail: 'bielrivero@gmail.com',
    
    // Duración del token en milisegundos (24 horas)
    tokenDuration: 24 * 60 * 60 * 1000,
    
    // Nombre de la cookie/storage
    sessionKey: 'curriculum_auth_token',
    
    // Clave secreta para generar tokens (CÁMBIALA por algo único y seguro)
    // Genera una nueva con: Math.random().toString(36).substring(2) + Date.now().toString(36)
    secretKey: 'grs_' + btoa('curriculum_2026_gabriel_rivero').replace(/=/g, '').substring(0, 32)
};

// Verificar autenticación al cargar la página
(function initAuth() {
    const isAuthenticated = checkAuthentication();
    
    if (isAuthenticated) {
        showMainContent();
    } else {
        showLoginScreen();
    }
})();

// Verificar si el usuario está autenticado
function checkAuthentication() {
    // Primero verificar si hay un token en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
        // Validar y guardar el token de la URL
        if (validateToken(tokenFromUrl)) {
            saveTokenSession(tokenFromUrl);
            // Limpiar URL sin recargar
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
    }
    
    // Verificar sesión existente
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const expirationTime = new Date(sessionData.expiration).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime < expirationTime) {
            return true;
        } else {
            // Sesión expirada
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
            return false;
        }
    } catch (error) {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
        return false;
    }
}

// Validar token
function validateToken(token) {
    try {
        // Decodificar token (formato: email|timestamp|hash)
        const parts = atob(token).split('|');
        if (parts.length !== 3) return false;
        
        const [email, timestamp, hash] = parts;
        const tokenTime = parseInt(timestamp);
        const currentTime = new Date().getTime();
        
        // Verificar que no haya expirado (24 horas)
        if (currentTime - tokenTime > AUTH_CONFIG.tokenDuration) {
            return false;
        }
        
        // Verificar hash (simple validación)
        const expectedHash = generateHash(email + timestamp);
        return hash === expectedHash;
    } catch (error) {
        return false;
    }
}

// Generar hash simple
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36) + AUTH_CONFIG.secretKey.length.toString(36);
}

// Guardar sesión desde token
function saveTokenSession(token) {
    const parts = atob(token).split('|');
    const [email, timestamp] = parts;
    
    const expiration = new Date(parseInt(timestamp) + AUTH_CONFIG.tokenDuration);
    
    const sessionData = {
        authenticated: true,
        email: email,
        expiration: expiration.toISOString(),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(sessionData));
}

// Generar token de acceso
function generateAccessToken(email) {
    const timestamp = new Date().getTime();
    const hash = generateHash(email + timestamp);
    const tokenData = `${email}|${timestamp}|${hash}`;
    return btoa(tokenData);
}

// Generar enlace mágico
function generateMagicLink(email) {
    const token = generateAccessToken(email);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?token=${token}`;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    location.reload();
}

// Mostrar pantalla de login
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (loginScreen) {
        loginScreen.style.display = 'flex';
    }
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

// Mostrar contenido principal
function showMainContent() {
    const loginScreen = document.getElementById('loginScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (loginScreen) {
        loginScreen.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// Manejar el formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('emailInput');
            const loginError = document.getElementById('loginError');
            const submitBtn = loginForm.querySelector('.btn-login');
            const enteredEmail = emailInput.value.trim();
            
            // Validar email
            if (!isValidEmail(enteredEmail)) {
                loginError.style.display = 'block';
                loginError.className = 'login-error error';
                loginError.innerHTML = '<i class="fas fa-times-circle"></i> Por favor, introduce un email válido.';
                emailInput.classList.add('shake');
                setTimeout(() => emailInput.classList.remove('shake'), 500);
                return;
            }
            
            // Deshabilitar botón
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Generar enlace mágico
                const magicLink = generateMagicLink(enteredEmail);
                
                // Enviar email con el enlace al solicitante
                await sendMagicLinkEmail(enteredEmail, magicLink);
                
                // 🔔 NOTIFICAR AL PROPIETARIO de la nueva solicitud
                await notifyOwnerNewRequest(enteredEmail);
                
                // Mostrar mensaje de éxito
                loginError.style.display = 'block';
                loginError.className = 'login-error success';
                loginError.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    ¡Enlace de acceso enviado!<br>
                    <small>Revisa tu email: ${enteredEmail}</small><br>
                    <small>El enlace es válido por 24 horas.</small>
                `;
                
                // Limpiar formulario
                emailInput.value = '';
                
                // Guardar solicitud de forma ENCRIPTADA
                // Si Supabase está configurado, guarda allí, sino en LocalStorage
                if (typeof saveAccessRequestToSupabase === 'function' && supabaseClient) {
                    await saveAccessRequestToSupabase(enteredEmail, magicLink);
                } else {
                    saveAccessRequestEncrypted(enteredEmail, magicLink);
                }
                
            } catch (error) {
                loginError.style.display = 'block';
                loginError.className = 'login-error error';
                loginError.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error al enviar el email.<br>
                    <small>Por favor, contacta directamente a: ${AUTH_CONFIG.ownerEmail}</small>
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Solicitar Acceso';
            }
        });
    }
    
});

// Validar formato de email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Enviar enlace mágico por email
async function sendMagicLinkEmail(userEmail, magicLink) {
    const timestamp = new Date().toLocaleString('es-ES', { 
        timeZone: 'Europe/Madrid',
        dateStyle: 'full',
        timeStyle: 'short'
    });
    
    // En desarrollo: SIEMPRE mostrar el enlace en consola
    console.log('%c🔑 ENLACE DE ACCESO (válido 24h):', 'font-size: 16px; font-weight: bold; color: #10b981;');
    console.log('%c' + magicLink, 'font-size: 14px; color: #6366f1; background: #f1f5f9; padding: 8px;');
    
    // Verificar si EmailJS está configurado
    if (typeof emailjs === 'undefined' || !EMAIL_CONFIG || EMAIL_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI') {
        console.warn('EmailJS no configurado. Usando solo modo consola.');
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    // Parámetros estándar de EmailJS
    const templateParams = {
        user_email: userEmail,
        user_name: userEmail.split('@')[0],
        message: `¡Hola!\n\nHas solicitado acceso al curriculum privado de Gabriel Rivero Sampol.\n\nHaz clic en el siguiente enlace para acceder:\n\n${magicLink}\n\n⏱️ Este enlace es válido por 24 horas.\n📅 Fecha de solicitud: ${timestamp}\n\nSi no solicitaste este acceso, puedes ignorar este email.\n\n---\nGabriel Rivero Sampol\n📧 bielrivero@gmail.com\n📱 678 528 138`,
        link: magicLink,
        timestamp: timestamp
    };
    
    console.log('📧 Enviando email a:', userEmail);
    console.log('📋 Parámetros:', { ...templateParams, message: '[mensaje largo...]' });
    
    try {
        // Enviar con EmailJS
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
        );
        console.log('✅ Email enviado correctamente:', response);
        console.log('✉️ El usuario', userEmail, 'debería recibir el email en breve');
        return response;
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        console.warn('⚠️ Revisa que el template "' + EMAIL_CONFIG.templateId + '" exista en EmailJS');
        console.log('📋 Usa estos parámetros en tu template: user_email, user_name, message, link, timestamp');
        throw error;
    }
}

// Guardar solicitudes de acceso ENCRIPTADAS
async function saveAccessRequestEncrypted(email, magicLink) {
    try {
        const timestamp = new Date().toISOString();
        const timestampES = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            dateStyle: 'full',
            timeStyle: 'medium'
        });
        
        // Encriptar datos sensibles
        const encryptedData = encryptData({
            email: email,
            magicLink: magicLink,
            timestamp: timestamp,
            status: 'sent',
            ip: 'hidden', // No capturamos IP por privacidad
            userAgent: navigator.userAgent.substring(0, 50) // Solo primeros 50 chars
        });
        
        let requests = JSON.parse(localStorage.getItem('access_requests_enc') || '[]');
        requests.push(encryptedData);
        
        // Limitar a últimas 100 solicitudes
        if (requests.length > 100) {
            requests = requests.slice(-100);
        }
        
        localStorage.setItem('access_requests_enc', JSON.stringify(requests));
        
        // 📧 ENVIAR NOTIFICACIÓN AL PROPIETARIO con datos de LocalStorage
        await sendLocalStorageNotification(email, magicLink, timestampES, requests.length);
        
        console.log('✅ Datos guardados en LocalStorage y notificación enviada');
    } catch (error) {
        console.error('Error al guardar solicitud encriptada:', error);
    }
}

// 📧 Enviar notificación al propietario sobre solicitudes en LocalStorage
async function sendLocalStorageNotification(email, magicLink, timestamp, totalRequests) {
    if (typeof emailjs === 'undefined' || !EMAIL_CONFIG || EMAIL_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI') {
        console.warn('EmailJS no configurado. No se puede enviar notificación.');
        return;
    }
    
    try {
        const templateParams = {
            to_email: EMAIL_CONFIG.toEmail, // Tu email
            subject: '🔔 Nueva solicitud de acceso (LocalStorage)',
            message: `Nueva solicitud de acceso al curriculum:\n\n📧 Email solicitante: ${email}\n📅 Fecha: ${timestamp}\n🔗 Enlace generado: ${magicLink}\n\n📊 Total de solicitudes registradas: ${totalRequests}\n💾 Almacenamiento: LocalStorage (encriptado)\n\n---\nEsta solicitud se guardó en LocalStorage porque Supabase está temporalmente deshabilitado.`,
            user_email: email,
            timestamp: timestamp,
            link: magicLink,
            total_requests: totalRequests
        };
        
        await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId, // Usa el mismo template o crea uno nuevo
            templateParams
        );
        
        console.log('✅ Notificación de LocalStorage enviada a:', EMAIL_CONFIG.toEmail);
    } catch (error) {
        console.error('❌ Error al enviar notificación de LocalStorage:', error);
    }
}

// Función simple de encriptación (XOR con clave)
function encryptData(data) {
    const key = AUTH_CONFIG.secretKey;
    const jsonStr = JSON.stringify(data);
    let encrypted = '';
    
    for (let i = 0; i < jsonStr.length; i++) {
        encrypted += String.fromCharCode(
            jsonStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    
    return btoa(encrypted); // Base64 encode
}

// Función para desencriptar (solo para el owner)
function decryptData(encryptedData) {
    try {
        const key = AUTH_CONFIG.secretKey;
        const decoded = atob(encryptedData);
        let decrypted = '';
        
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(
                decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Error al desencriptar:', error);
        return null;
    }
}

// Notificar al propietario de nueva solicitud
async function notifyOwnerNewRequest(userEmail) {
    const timestamp = new Date().toLocaleString('es-ES', { 
        timeZone: 'Europe/Madrid',
        dateStyle: 'full',
        timeStyle: 'short'
    });
    
    // Verificar si EmailJS está configurado
    if (typeof emailjs === 'undefined' || !EMAIL_CONFIG || EMAIL_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI') {
        console.log('📧 Notificación al owner (EmailJS no configurado):', userEmail);
        return Promise.resolve();
    }
    
    try {
        // Enviar notificación al propietario
        await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            {
                user_email: AUTH_CONFIG.ownerEmail,
                user_name: 'Gabriel',
                message: `🔔 NUEVA SOLICITUD DE ACCESO AL CURRICULUM\n\n` +
                        `Email solicitante: ${userEmail}\n` +
                        `Fecha y hora: ${timestamp}\n\n` +
                        `Un usuario ha solicitado acceso a tu curriculum privado.\n` +
                        `Se le ha enviado un enlace mágico válido por 24 horas.\n\n` +
                        `---\n` +
                        `Sistema de notificación automática\n` +
                        `Curriculum Privado - Gabriel Rivero Sampol`,
                link: window.location.origin,
                timestamp: timestamp
            }
        );
        
        console.log('✅ Notificación enviada al propietario');
    } catch (error) {
        console.error('❌ Error al notificar al propietario:', error);
        // No bloqueamos el flujo aunque falle la notificación
    }
}

// Sistema de notificaciones
let notificationCount = 0;

// ========================================
// INICIALIZACIÓN DE EMAILJS
// ========================================
(function() {
    // Inicializar EmailJS si está configurado
    if (typeof emailjs !== 'undefined' && typeof EMAIL_CONFIG !== 'undefined' && EMAIL_CONFIG.publicKey !== 'TU_PUBLIC_KEY_AQUI') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('EmailJS inicializado correctamente');
    } else {
        console.log('EmailJS no configurado. Usando modo de simulación.');
    }
})();

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <div>${message}</div>
    `;
    
    container.appendChild(notification);
    notificationCount++;
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            container.removeChild(notification);
            notificationCount--;
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
    };
    return icons[type] || icons.info;
}

// Indicador de actividad
function updateActivityStatus(isActive = true) {
    const indicator = document.getElementById('activityIndicator');
    const icon = indicator.querySelector('i');
    const text = indicator.querySelector('span');
    
    if (isActive) {
        icon.style.color = 'var(--success-color)';
        text.textContent = 'En línea';
    } else {
        icon.style.color = 'var(--danger-color)';
        text.textContent = 'Ausente';
    }
}

// Detección de actividad del usuario
let inactivityTimer;
const INACTIVITY_TIME = 300000; // 5 minutos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    updateActivityStatus(true);
    
    inactivityTimer = setTimeout(() => {
        updateActivityStatus(false);
        showNotification('Has estado inactivo. Tu estado se ha cambiado a ausente.', 'warning');
    }, INACTIVITY_TIME);
}

// Eventos de actividad
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Iniciar temporizador de inactividad
resetInactivityTimer();

// Smooth scroll para navegación
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de navbar al hacer scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Animación de imagen de perfil
const profileVideo = document.getElementById('profileVideo');
const videoToggleBtn = document.getElementById('videoToggleBtn');

// Control de reproducción de video
if (profileVideo && videoToggleBtn) {
    // Verificar si es la primera visita
    const hasPlayedBefore = localStorage.getItem('videoPlayed');
    
    if (!hasPlayedBefore) {
        // Primera vez: reproducir automáticamente
        profileVideo.play().then(() => {
            localStorage.setItem('videoPlayed', 'true');
            videoToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
            // Si falla el autoplay, mostrar botón de play
            videoToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    } else {
        // No es la primera vez: mantener pausado
        profileVideo.pause();
        videoToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // Cuando el video termina, cambiar a botón de play
    profileVideo.addEventListener('ended', function() {
        videoToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    videoToggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (profileVideo.paused || profileVideo.ended) {
            profileVideo.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            profileVideo.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Click en el video también controla reproducción
    profileVideo.addEventListener('click', function() {
        if (this.paused || this.ended) {
            this.play();
            videoToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.pause();
            videoToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value,
        timestamp: new Date().toISOString()
    };
    
    // Deshabilitar botón durante el envío
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Simular envío de correo (aquí integrarías tu servicio de email)
        await sendEmail(formData);
        
        // Mostrar mensaje de éxito
        formResponse.className = 'form-response success';
        formResponse.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
        
        // Notificación
        showNotification('Tu mensaje ha sido enviado correctamente', 'success');
        
        // Limpiar formulario
        contactForm.reset();
        
        // Guardar en localStorage como registro
        saveMessageToLocal(formData);
        
    } catch (error) {
        formResponse.className = 'form-response error';
        formResponse.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
        showNotification('Error al enviar el mensaje', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formResponse.style.display = 'none';
        }, 5000);
    }
});

// Función para enviar email (usando EmailJS o similar)
async function sendEmail(data) {
    // Verificar si EmailJS está configurado
    if (typeof emailjs === 'undefined' || !EMAIL_CONFIG || EMAIL_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI') {
        console.warn('EmailJS no está configurado. Simulando envío...');
        // Simular envío exitoso
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email simulado:', data);
                resolve();
            }, 1000);
        });
    }

    // Enviar con EmailJS
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

// Función para enviar notificación al admin (para sistema de autenticación)
async function sendEmailToAdmin(data) {
    // Verificar si EmailJS está configurado
    if (typeof emailjs === 'undefined' || !EMAIL_CONFIG || EMAIL_CONFIG.publicKey === 'TU_PUBLIC_KEY_AQUI') {
        console.warn('EmailJS no está configurado. Guardando solicitud localmente...');
        return Promise.resolve();
    }

    // Enviar con EmailJS
    return emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        {
            from_name: data.from_name,
            from_email: data.from_email,
            subject: data.subject,
            message: data.message,
            to_email: EMAIL_CONFIG.toEmail,
            timestamp: data.timestamp
        }
    );
}

// Hacer disponible globalmente
window.sendEmailToAdmin = sendEmailToAdmin;

// Guardar mensajes en localStorage
function saveMessageToLocal(data) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(data);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Actualizar contador de mensajes
    updateMessageCounter();
}

// Contador de mensajes nuevos
function updateMessageCounter() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const unreadMessages = messages.filter(msg => !msg.read).length;
    
    if (unreadMessages > 0) {
        showNotification(`Tienes ${unreadMessages} mensaje(s) nuevo(s)`, 'info');
    }
}

// Verificar mensajes al cargar la página
window.addEventListener('load', () => {
    showNotification('¡Bienvenido a mi curriculum interactivo!', 'success');
    updateMessageCounter();
});

// Sistema de observación para animaciones al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos con animación
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// Efectos interactivos en tarjetas
document.querySelectorAll('.skill-card, .email-card, .timeline-content').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Función para copiar email al portapapeles
document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.textContent;
        
        navigator.clipboard.writeText(email).then(() => {
            showNotification(`Email ${email} copiado al portapapeles`, 'success');
        }).catch(() => {
            // Fallback si no funciona clipboard API
            window.location.href = link.href;
        });
    });
});

// Agregar CSS de animación slideOutRight dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Sistema de estadísticas de visitas
function trackVisit() {
    let visits = parseInt(localStorage.getItem('visits') || '0');
    visits++;
    localStorage.setItem('visits', visits.toString());
    localStorage.setItem('lastVisit', new Date().toISOString());
    
    if (visits > 1) {
        console.log(`Esta es tu visita número ${visits}`);
    }
}

trackVisit();

// Log para depuración
console.log('%c¡Hola! 👋', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cGracias por visitar mi curriculum interactivo', 'font-size: 14px; color: #334155;');
console.log('%cMensajes guardados:', 'font-weight: bold;');
console.log(JSON.parse(localStorage.getItem('messages') || '[]'));
