// ========================================
// SISTEMA DE AUTENTICACIÓN SEGURO
// ========================================

class SecureAuth {
    constructor() {
        this.storageKey = 'curriculum_auth';
        this.passwordKey = 'curriculum_password';
        this.adminEmail = 'tu-email@ejemplo.com'; // Cambia esto por tu email real
    }

    // Generar contraseña segura basada en fecha
    generateDailyPassword() {
        const today = new Date();
        const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        // Semilla secreta (cámbiala por algo único y personal)
        const secretSeed = 'MI_CLAVE_SECRETA_PERSONAL_2026';
        
        // Generar hash simple
        const combined = dateString + secretSeed;
        let hash = 0;
        
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        // Convertir a password alfanumérico de 8 caracteres
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let password = '';
        let tempHash = Math.abs(hash);
        
        for (let i = 0; i < 8; i++) {
            password += chars[tempHash % chars.length];
            tempHash = Math.floor(tempHash / chars.length);
            if (tempHash === 0) tempHash = Math.abs(hash) + i;
        }
        
        return password;
    }

    // Verificar si la sesión es válida
    isAuthenticated() {
        const authData = localStorage.getItem(this.storageKey);
        if (!authData) return false;

        try {
            const { timestamp, token } = JSON.parse(authData);
            const now = new Date().getTime();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            // Verificar si han pasado más de 24 horas
            if (now - timestamp > twentyFourHours) {
                this.logout();
                return false;
            }

            // Verificar que el token sea del día actual
            const todayPassword = this.generateDailyPassword();
            return token === this.hashPassword(todayPassword);
        } catch {
            return false;
        }
    }

    // Hash simple de password (en producción usa algo más robusto)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Intentar login
    async login(password, visitorEmail = null, visitorName = null) {
        const todayPassword = this.generateDailyPassword();
        
        if (password === todayPassword) {
            // Login exitoso
            const authData = {
                timestamp: new Date().getTime(),
                token: this.hashPassword(password),
                isAdmin: true
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(authData));
            
            // Registrar acceso
            this.logAccess('admin', true);
            
            return { success: true, message: 'Acceso concedido' };
        } else {
            // Si proporciona email, enviar notificación al admin
            if (visitorEmail && visitorName) {
                await this.notifyAdmin(visitorName, visitorEmail);
                this.logAccess('visitor', false, visitorEmail);
                
                return { 
                    success: false, 
                    message: 'Contraseña incorrecta. El administrador ha sido notificado de tu solicitud de acceso.',
                    notified: true
                };
            }
            
            this.logAccess('unknown', false);
            return { success: false, message: 'Contraseña incorrecta' };
        }
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem(this.storageKey);
        this.logAccess('admin', false, null, 'logout');
    }

    // Registrar intentos de acceso
    logAccess(userType, success, email = null, action = 'login') {
        let accessLog = JSON.parse(localStorage.getItem('access_log') || '[]');
        
        accessLog.push({
            timestamp: new Date().toISOString(),
            userType,
            success,
            email,
            action,
            password: this.generateDailyPassword() // Para tu referencia
        });
        
        // Mantener solo los últimos 50 registros
        if (accessLog.length > 50) {
            accessLog = accessLog.slice(-50);
        }
        
        localStorage.setItem('access_log', JSON.stringify(accessLog));
    }

    // Notificar al admin de solicitud de acceso
    async notifyAdmin(visitorName, visitorEmail) {
        const todayPassword = this.generateDailyPassword();
        
        // Preparar datos para enviar email
        const emailData = {
            to_email: this.adminEmail,
            from_name: visitorName,
            from_email: visitorEmail,
            subject: '🔔 Solicitud de acceso a tu Curriculum',
            message: `
                ${visitorName} (${visitorEmail}) ha intentado acceder a tu curriculum.
                
                Fecha y hora: ${new Date().toLocaleString('es-ES')}
                
                Si deseas compartir el acceso, la contraseña de hoy es: ${todayPassword}
                
                Esta contraseña expira en: ${this.getPasswordExpiration()}
            `,
            timestamp: new Date().toLocaleString('es-ES')
        };

        // Enviar usando la función global sendEmail si existe
        if (typeof window.sendEmailToAdmin === 'function') {
            try {
                await window.sendEmailToAdmin(emailData);
                console.log('Notificación enviada al admin');
            } catch (error) {
                console.error('Error al enviar notificación:', error);
            }
        }

        // También guardar en localStorage para revisión
        let notifications = JSON.parse(localStorage.getItem('access_requests') || '[]');
        notifications.push({
            ...emailData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('access_requests', JSON.stringify(notifications));
    }

    // Obtener tiempo de expiración de contraseña
    getPasswordExpiration() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const now = new Date();
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours} horas y ${minutes} minutos`;
    }

    // Obtener contraseña del día (solo para admin)
    getTodayPassword() {
        if (this.isAuthenticated()) {
            return this.generateDailyPassword();
        }
        return null;
    }

    // Verificar tiempo restante de sesión
    getSessionTimeRemaining() {
        const authData = localStorage.getItem(this.storageKey);
        if (!authData) return null;

        try {
            const { timestamp } = JSON.parse(authData);
            const now = new Date().getTime();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const remaining = twentyFourHours - (now - timestamp);

            if (remaining <= 0) return null;

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            return { hours, minutes, milliseconds: remaining };
        } catch {
            return null;
        }
    }
}

// Crear instancia global
const auth = new SecureAuth();

// Función para mostrar modal de login
function showLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('loginPassword').focus();
    }
}

// Función para ocultar modal
function hideLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Manejar envío de formulario de login
async function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('loginPassword').value;
    const visitorName = document.getElementById('visitorName')?.value;
    const visitorEmail = document.getElementById('visitorEmail')?.value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    
    try {
        const result = await auth.login(password, visitorEmail, visitorName);
        
        if (result.success) {
            hideLoginModal();
            location.reload(); // Recargar para mostrar contenido
        } else {
            const errorMsg = document.getElementById('loginError');
            errorMsg.textContent = result.message;
            errorMsg.style.display = 'block';
            
            if (result.notified) {
                setTimeout(() => {
                    errorMsg.textContent = 'Tu solicitud ha sido enviada. El propietario te contactará.';
                    errorMsg.style.backgroundColor = '#3b82f6';
                }, 2000);
            }
        }
    } catch (error) {
        const errorMsg = document.getElementById('loginError');
        errorMsg.textContent = 'Error al procesar la solicitud';
        errorMsg.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Función para logout
function handleLogout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        auth.logout();
        location.reload();
    }
}

// Verificar autenticación al cargar
window.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        // Ocultar todo el contenido excepto el modal de login
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        showLoginModal();
    } else {
        // Mostrar contenido y botón de logout
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        // Mostrar información de sesión
        const sessionInfo = auth.getSessionTimeRemaining();
        if (sessionInfo) {
            console.log(`Sesión válida. Expira en: ${sessionInfo.hours}h ${sessionInfo.minutes}m`);
            
            // Notificar cuando falte poco para expirar
            if (sessionInfo.hours < 1) {
                showNotification(`Tu sesión expirará en ${sessionInfo.minutes} minutos`, 'warning');
            }
        }
    }
});

// Exportar para uso global
window.auth = auth;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
