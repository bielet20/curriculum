// ========================================
// CONFIGURACIÓN DE SUPABASE
// ========================================

/*
 * Supabase es una alternativa open-source a Firebase
 * Incluye PostgreSQL, autenticación, storage y más
 * Plan gratuito: 500MB base de datos + 1GB storage
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 
 * 1. Crea cuenta en https://supabase.com (gratis)
 * 2. Crea un nuevo proyecto
 * 3. Ve a Settings → API
 * 4. Copia Project URL y anon/public key
 * 5. Reemplaza los valores abajo
 * 6. Ejecuta el script SQL en el SQL Editor (ver supabase-schema.sql)
 */

const SUPABASE_CONFIG = {
    // URL de tu proyecto Supabase
    url: 'https://zkbgqssebdwcphrfwlsa.supabase.co',
    
    // Anon/Public Key (es seguro exponerla en el frontend)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprYmdxc3NlYmR3Y3BocmZ3bHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjM1MTgsImV4cCI6MjA4NDQ5OTUxOH0.WFH4f3RhPdsdbylX1irM1hx9M2MfLUDrh8oETY7dDxQ',
    
    // Habilitar Supabase (true) o usar LocalStorage (false)
    // TEMPORALMENTE DESHABILITADO - Se habilitará después del redeploy en Coolify
    enabled: false
};

// Cliente de Supabase (se inicializa automáticamente)
let supabaseClient = null;

// Inicializar Supabase
function initSupabase() {
    if (!SUPABASE_CONFIG.enabled) {
        console.log('ℹ️ Supabase deshabilitado. Usando LocalStorage.');
        return null;
    }
    
    if (typeof supabase === 'undefined') {
        console.error('❌ SDK de Supabase no cargado. Añade el script en index-protegido.html');
        return null;
    }
    
    if (SUPABASE_CONFIG.url === 'https://TU_PROYECTO.supabase.co') {
        console.warn('⚠️ Supabase no configurado. Usando LocalStorage.');
        return null;
    }
    
    try {
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        
        console.log('✅ Supabase inicializado correctamente');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
        return null;
    }
}

// Guardar solicitud de acceso en Supabase
async function saveAccessRequestToSupabase(email, magicLink) {
    if (!supabaseClient) {
        console.log('ℹ️ Supabase no disponible, guardando en LocalStorage');
        return saveAccessRequestEncrypted(email, magicLink);
    }
    
    try {
        // Hash del email para privacidad adicional
        console.log('🔐 Generando hash para:', email);
        const emailHash = await hashString(email);
        console.log('✅ Hash generado:', emailHash);
        
        const dataToInsert = {
            email_hash: emailHash,
            email_encrypted: encryptData({ email: email }),
            requested_at: new Date().toISOString(),
            status: 'sent',
            user_agent: navigator.userAgent.substring(0, 100)
        };
        
        console.log('📤 Insertando en Supabase:', { ...dataToInsert, email_encrypted: '[encrypted]' });
        
        const { data, error } = await supabaseClient
            .from('access_requests')
            .insert(dataToInsert)
            .select();
        
        if (error) {
            console.error('❌ Error de Supabase:', error);
            console.error('Detalles:', error.message, error.details, error.hint);
            throw error;
        }
        
        console.log('✅ Solicitud guardada en Supabase:', data);
        
        // También guardar en LocalStorage como backup
        saveAccessRequestEncrypted(email, magicLink);
        
        return data;
    } catch (error) {
        console.error('❌ Error al guardar en Supabase:', error);
        console.error('Tipo de error:', error.constructor.name);
        console.error('Stack:', error.stack);
        // Fallback a LocalStorage
        return saveAccessRequestEncrypted(email, magicLink);
    }
}

// Hash simple y rápido (sin Web Crypto API para evitar problemas)
async function hashString(str) {
    console.log('🔐 Generando hash simple para email');
    // Hash simple pero efectivo
    let hash = 0;
    const fullStr = str + AUTH_CONFIG.secretKey;
    for (let i = 0; i < fullStr.length; i++) {
        const char = fullStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const result = Math.abs(hash).toString(16).padStart(8, '0');
    console.log('✅ Hash generado correctamente:', result);
    return result;
}

// Obtener estadísticas de solicitudes (solo para el owner)
async function getAccessRequestsStats() {
    if (!supabaseClient) {
        console.log('ℹ️ Supabase no disponible');
        return null;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('access_requests')
            .select('*')
            .order('requested_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        return {
            total: data.length,
            last24h: data.filter(r => {
                const requestDate = new Date(r.requested_at);
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return requestDate > yesterday;
            }).length,
            requests: data
        };
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        return null;
    }
}

// Hacer disponible globalmente
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initSupabase = initSupabase;
window.saveAccessRequestToSupabase = saveAccessRequestToSupabase;
window.getAccessRequestsStats = getAccessRequestsStats;
