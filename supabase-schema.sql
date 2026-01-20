-- ========================================
-- SCHEMA DE BASE DE DATOS PARA SUPABASE
-- ========================================
-- 
-- Ejecuta este script en Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Pega esto → Run
--

-- 1. Crear tabla de solicitudes de acceso
CREATE TABLE IF NOT EXISTS access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_hash VARCHAR(64) NOT NULL,
    email_encrypted TEXT NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'sent',
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_access_requests_email_hash 
    ON access_requests(email_hash);

CREATE INDEX IF NOT EXISTS idx_access_requests_requested_at 
    ON access_requests(requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_access_requests_status 
    ON access_requests(status);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- 4. Política: Solo lectura pública (para insertar desde frontend)
-- Cualquiera puede insertar solicitudes
CREATE POLICY "Cualquiera puede insertar solicitudes"
    ON access_requests
    FOR INSERT
    WITH CHECK (true);

-- 5. Política: Solo lectura para usuarios autenticados
-- Si quieres ver las solicitudes, necesitas autenticarte
CREATE POLICY "Solo lectura para autenticados"
    ON access_requests
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_access_requests_updated_at ON access_requests;
CREATE TRIGGER update_access_requests_updated_at
    BEFORE UPDATE ON access_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Vista para estadísticas (sin datos sensibles)
CREATE OR REPLACE VIEW access_requests_stats AS
SELECT 
    DATE(requested_at) as date,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN accessed_at IS NOT NULL THEN 1 END) as accessed,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as pending
FROM access_requests
GROUP BY DATE(requested_at)
ORDER BY date DESC;

-- 9. Función para limpiar solicitudes antiguas (>90 días)
CREATE OR REPLACE FUNCTION cleanup_old_requests()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM access_requests
    WHERE requested_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 10. Comentarios en las tablas (documentación)
COMMENT ON TABLE access_requests IS 'Solicitudes de acceso al curriculum privado';
COMMENT ON COLUMN access_requests.email_hash IS 'Hash SHA-256 del email para búsquedas sin exponer datos';
COMMENT ON COLUMN access_requests.email_encrypted IS 'Email encriptado (solo lectura por autenticados)';
COMMENT ON COLUMN access_requests.requested_at IS 'Fecha y hora de la solicitud';
COMMENT ON COLUMN access_requests.status IS 'Estado: sent, accessed, revoked';
COMMENT ON COLUMN access_requests.user_agent IS 'User agent del navegador (primeros 100 caracteres)';
COMMENT ON COLUMN access_requests.accessed_at IS 'Fecha y hora del primer acceso exitoso';

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Ver todas las solicitudes (solo si estás autenticado)
-- SELECT * FROM access_requests ORDER BY requested_at DESC;

-- Ver estadísticas
-- SELECT * FROM access_requests_stats;

-- Limpiar solicitudes antiguas manualmente
-- SELECT cleanup_old_requests();

-- Contar solicitudes por estado
-- SELECT status, COUNT(*) FROM access_requests GROUP BY status;

-- ========================================
-- OPCIONAL: PROGRAMAR LIMPIEZA AUTOMÁTICA
-- ========================================

-- Usa pg_cron (si está habilitado en tu plan de Supabase)
-- SELECT cron.schedule(
--     'cleanup-old-access-requests',
--     '0 2 * * *', -- Cada día a las 2 AM
--     $$SELECT cleanup_old_requests()$$
-- );

-- ========================================
-- SEGURIDAD ADICIONAL
-- ========================================

-- Revocar acceso directo a la tabla para usuarios públicos
REVOKE ALL ON access_requests FROM anon;
REVOKE ALL ON access_requests FROM authenticated;

-- Solo permitir INSERT para anon (frontend)
GRANT INSERT ON access_requests TO anon;

-- Permitir SELECT para authenticated (dashboard de admin)
GRANT SELECT ON access_requests TO authenticated;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================

-- ✅ Si todo se ejecutó correctamente, deberías ver:
-- - Tabla 'access_requests' creada
-- - Índices creados
-- - RLS habilitado
-- - Políticas aplicadas
-- - Funciones y triggers creados
