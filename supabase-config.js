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
    anonKey: 'sb_publishable_9_1YeV_dHAk6SlThNgek_Q_WJZrSL4Z',
    
    // Habilitar Supabase (true) o usar LocalStorage (false)
    enabled: true
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
        const emailHash = await hashString(email);
        
        const { data, error } = await supabaseClient
            .from('access_requests')
            .insert({
                email_hash: emailHash,
                email_encrypted: encryptData({ email: email }),
                requested_at: new Date().toISOString(),
                status: 'sent',
                user_agent: navigator.userAgent.substring(0, 100)
            })
            .select();
        
        if (error) throw error;
        
        console.log('✅ Solicitud guardada en Supabase:', data);
        
        // También guardar en LocalStorage como backup
        saveAccessRequestEncrypted(email, magicLink);
        
        return data;
    } catch (error) {
        console.error('❌ Error al guardar en Supabase:', error);
        // Fallback a LocalStorage
        return saveAccessRequestEncrypted(email, magicLink);
    }
}

// Hash de string con Web Crypto API
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str + AUTH_CONFIG.secretKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
