// ========================================
// 🔑 PANEL DE ADMINISTRACIÓN - DEMO
// ========================================

/*
Este archivo te ayuda a entender y gestionar tu sistema de seguridad.
Abre la consola del navegador (F12) y pega estos comandos.
*/

// ========================================
// OBTENER CONTRASEÑA ACTUAL
// ========================================

function obtenerContraseñaHoy() {
    if (typeof auth !== 'undefined') {
        const password = auth.generateDailyPassword();
        console.log('╔═══════════════════════════════════════╗');
        console.log('║   🔐 CONTRASEÑA DE HOY                ║');
        console.log('╠═══════════════════════════════════════╣');
        console.log(`║   Contraseña: ${password}              ║`);
        console.log(`║   Fecha: ${new Date().toLocaleDateString('es-ES')}        ║`);
        console.log('║   Válida por: 24 horas                ║');
        console.log('╚═══════════════════════════════════════╝');
        
        // Copiar al portapapeles
        if (navigator.clipboard) {
            navigator.clipboard.writeText(password);
            console.log('✅ Contraseña copiada al portapapeles');
        }
        
        return password;
    } else {
        console.error('❌ Sistema de autenticación no cargado');
        return null;
    }
}

// ========================================
// VER LOG DE ACCESOS
// ========================================

function verLogAccesos() {
    const log = JSON.parse(localStorage.getItem('access_log') || '[]');
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║          📊 REGISTRO DE ACCESOS                       ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    
    if (log.length === 0) {
        console.log('║  No hay registros aún                                 ║');
    } else {
        log.slice(-10).reverse().forEach((entry, index) => {
            const fecha = new Date(entry.timestamp).toLocaleString('es-ES');
            const tipo = entry.userType === 'admin' ? '👑 Admin' : '👤 Visitante';
            const estado = entry.success ? '✅ Exitoso' : '❌ Fallido';
            
            console.log(`║ ${index + 1}. ${tipo} - ${estado}`);
            console.log(`║    📅 ${fecha}`);
            if (entry.email) {
                console.log(`║    📧 ${entry.email}`);
            }
            console.log('╟───────────────────────────────────────────────────────╢');
        });
    }
    
    console.log(`║  Total de accesos: ${log.length}`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return log;
}

// ========================================
// VER SOLICITUDES PENDIENTES
// ========================================

function verSolicitudes() {
    const requests = JSON.parse(localStorage.getItem('access_requests') || '[]');
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║        📬 SOLICITUDES DE ACCESO                       ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    
    if (requests.length === 0) {
        console.log('║  No hay solicitudes pendientes                        ║');
    } else {
        requests.slice(-5).reverse().forEach((req, index) => {
            const fecha = new Date(req.timestamp).toLocaleString('es-ES');
            
            console.log(`║ ${index + 1}. ${req.from_name}`);
            console.log(`║    📧 ${req.from_email}`);
            console.log(`║    📅 ${fecha}`);
            console.log('╟───────────────────────────────────────────────────────╢');
        });
    }
    
    console.log(`║  Total de solicitudes: ${requests.length}`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return requests;
}

// ========================================
// INFORMACIÓN DE SESIÓN
// ========================================

function infoSesion() {
    if (typeof auth === 'undefined') {
        console.error('❌ Sistema de autenticación no cargado');
        return;
    }
    
    const esAutenticado = auth.isAuthenticated();
    const tiempoRestante = auth.getSessionTimeRemaining();
    
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║     ℹ️  INFORMACIÓN DE SESIÓN         ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║  Estado: ${esAutenticado ? '🟢 Autenticado' : '🔴 No autenticado'}    ║`);
    
    if (tiempoRestante) {
        console.log(`║  Tiempo restante: ${tiempoRestante.hours}h ${tiempoRestante.minutes}m          ║`);
    }
    
    const expiracion = auth.getPasswordExpiration();
    console.log(`║  Contraseña expira en: ${expiracion} ║`);
    console.log('╚═══════════════════════════════════════╝\n');
    
    return {
        autenticado: esAutenticado,
        tiempoRestante: tiempoRestante,
        expiracionPassword: expiracion
    };
}

// ========================================
// ESTADÍSTICAS
// ========================================

function estadisticas() {
    const log = JSON.parse(localStorage.getItem('access_log') || '[]');
    const requests = JSON.parse(localStorage.getItem('access_requests') || '[]');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    const exitosos = log.filter(l => l.success).length;
    const fallidos = log.filter(l => !l.success).length;
    const visitantes = log.filter(l => l.userType === 'visitor').length;
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║              📈 ESTADÍSTICAS GENERALES                ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log(`║  Total accesos: ${log.length}`);
    console.log(`║  Accesos exitosos: ${exitosos}`);
    console.log(`║  Accesos fallidos: ${fallidos}`);
    console.log(`║  Solicitudes de visitantes: ${visitantes}`);
    console.log(`║  Solicitudes pendientes: ${requests.length}`);
    console.log(`║  Mensajes recibidos: ${messages.length}`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return {
        totalAccesos: log.length,
        exitosos,
        fallidos,
        visitantes,
        solicitudesPendientes: requests.length,
        mensajes: messages.length
    };
}

// ========================================
// LIMPIAR DATOS
// ========================================

function limpiarDatos(tipo = 'todo') {
    const confirmacion = confirm('⚠️ ¿Estás seguro de que quieres limpiar los datos?');
    
    if (!confirmacion) {
        console.log('❌ Operación cancelada');
        return;
    }
    
    switch(tipo) {
        case 'log':
            localStorage.removeItem('access_log');
            console.log('✅ Log de accesos limpiado');
            break;
        case 'solicitudes':
            localStorage.removeItem('access_requests');
            console.log('✅ Solicitudes limpiadas');
            break;
        case 'mensajes':
            localStorage.removeItem('messages');
            console.log('✅ Mensajes limpiados');
            break;
        case 'sesion':
            localStorage.removeItem('curriculum_auth');
            console.log('✅ Sesión cerrada');
            break;
        case 'todo':
            localStorage.clear();
            console.log('✅ Todos los datos limpiados');
            break;
        default:
            console.log('❌ Tipo no válido. Usa: log, solicitudes, mensajes, sesion, todo');
    }
}

// ========================================
// GENERAR CONTRASEÑAS FUTURAS
// ========================================

function verContraseñasFuturas(dias = 7) {
    if (typeof auth === 'undefined') {
        console.error('❌ Sistema de autenticación no cargado');
        return;
    }
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         🔮 CONTRASEÑAS FUTURAS (PRÓXIMOS DÍAS)        ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    
    const passwords = [];
    
    for (let i = 0; i < dias; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + i);
        
        // Generar contraseña para esa fecha
        const dateString = `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`;
        const secretSeed = 'MI_CLAVE_SECRETA_PERSONAL_2026'; // Debe coincidir con auth.js
        const combined = dateString + secretSeed;
        
        let hash = 0;
        for (let j = 0; j < combined.length; j++) {
            const char = combined.charCodeAt(j);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let password = '';
        let tempHash = Math.abs(hash);
        
        for (let k = 0; k < 8; k++) {
            password += chars[tempHash % chars.length];
            tempHash = Math.floor(tempHash / chars.length);
            if (tempHash === 0) tempHash = Math.abs(hash) + k;
        }
        
        const dia = fecha.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit' 
        });
        
        console.log(`║  ${dia}: ${password}${i === 0 ? ' ⭐ HOY' : ''}`);
        passwords.push({ fecha: fecha.toLocaleDateString('es-ES'), password });
    }
    
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    return passwords;
}

// ========================================
// COMANDOS DISPONIBLES
// ========================================

function ayuda() {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║           🎮 COMANDOS DISPONIBLES                     ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log('║                                                       ║');
    console.log('║  obtenerContraseñaHoy()                               ║');
    console.log('║  → Muestra la contraseña del día                      ║');
    console.log('║                                                       ║');
    console.log('║  verLogAccesos()                                      ║');
    console.log('║  → Muestra el historial de accesos                    ║');
    console.log('║                                                       ║');
    console.log('║  verSolicitudes()                                     ║');
    console.log('║  → Muestra solicitudes de acceso pendientes           ║');
    console.log('║                                                       ║');
    console.log('║  infoSesion()                                         ║');
    console.log('║  → Información sobre tu sesión actual                 ║');
    console.log('║                                                       ║');
    console.log('║  estadisticas()                                       ║');
    console.log('║  → Estadísticas generales del sistema                 ║');
    console.log('║                                                       ║');
    console.log('║  verContraseñasFuturas(7)                             ║');
    console.log('║  → Ver contraseñas de los próximos 7 días             ║');
    console.log('║                                                       ║');
    console.log('║  limpiarDatos("tipo")                                 ║');
    console.log('║  → Tipos: log, solicitudes, mensajes, sesion, todo    ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('💡 Tip: Copia y pega estos comandos en la consola\n');
}

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================

if (typeof window !== 'undefined') {
    window.obtenerContraseñaHoy = obtenerContraseñaHoy;
    window.verLogAccesos = verLogAccesos;
    window.verSolicitudes = verSolicitudes;
    window.infoSesion = infoSesion;
    window.estadisticas = estadisticas;
    window.limpiarDatos = limpiarDatos;
    window.verContraseñasFuturas = verContraseñasFuturas;
    window.ayuda = ayuda;
    
    // Mensaje de bienvenida
    console.log('\n🎉 Panel de Administración cargado');
    console.log('📝 Escribe ayuda() para ver los comandos disponibles\n');
}
