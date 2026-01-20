# 🗄️ Guía de Configuración de Supabase

## 📋 Paso a Paso (10 minutos)

### 1️⃣ Crear Cuenta en Supabase

1. **Ve a**: https://supabase.com
2. **Sign Up** con GitHub o Email
3. **Confirma** tu email

### 2️⃣ Crear Nuevo Proyecto

1. Click en **"New Project"**
2. **Nombre**: `curriculum-web` (o el que prefieras)
3. **Database Password**: Genera una contraseña segura (guárdala)
4. **Region**: Elige la más cercana (Europe West por ejemplo)
5. **Plan**: Free (500MB gratis)
6. Click en **"Create New Project"**
7. **Espera 2-3 minutos** mientras Supabase crea tu base de datos

### 3️⃣ Obtener Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️ en la barra lateral)
2. Click en **API**
3. Verás:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Copia** estos dos valores

### 4️⃣ Configurar en tu Proyecto

**Edita `supabase-config.js`:**

```javascript
const SUPABASE_CONFIG = {
    // Pega tu Project URL
    url: 'https://xxxxxxxxxxxxx.supabase.co',
    
    // Pega tu anon key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    
    // Habilitar Supabase
    enabled: true  // ← Cambia a true
};
```

### 5️⃣ Crear Tabla en la Base de Datos

1. En Supabase Dashboard, ve a **SQL Editor** (icono de datos)
2. Click en **"New Query"**
3. **Copia TODO el contenido** de `supabase-schema.sql`
4. **Pégalo** en el editor
5. Click en **"Run"** (▶️ abajo a la derecha)
6. **Verás**: ✅ Success. No rows returned

### 6️⃣ Verificar Tabla Creada

1. Ve a **Table Editor** en la barra lateral
2. Deberías ver la tabla **`access_requests`**
3. Click en ella para ver la estructura:
   ```
   id               | uuid
   email_hash       | varchar(64)
   email_encrypted  | text
   requested_at     | timestamp
   status           | varchar(50)
   user_agent       | text
   accessed_at      | timestamp
   created_at       | timestamp
   updated_at       | timestamp
   ```

### 7️⃣ Subir a GitHub y Coolify

```bash
cd "/Applications/web curriculum proyecto"

git add supabase-config.js supabase-schema.sql index-protegido.html script.js
git commit -m "Feature: integración con Supabase para base de datos real"
git push origin main
```

Coolify redesplegará automáticamente.

### 8️⃣ Probar

1. **Accede** a tu aplicación en Coolify
2. **Solicita acceso** con un email
3. **Ve a Supabase** → Table Editor → `access_requests`
4. **Deberías ver** la solicitud guardada ✅

---

## 🔍 Ver Datos en Supabase

### Ver Todas las Solicitudes

1. **Table Editor** → `access_requests`
2. Verás todas las solicitudes con:
   - Hash del email (no el email real por privacidad)
   - Fecha de solicitud
   - Estado (sent, accessed, revoked)
   - User agent

### Desencriptar Email (solo tú)

En el **SQL Editor**:

```sql
SELECT 
    id,
    requested_at,
    status,
    email_encrypted
FROM access_requests
ORDER BY requested_at DESC
LIMIT 20;
```

Los emails están encriptados. Para verlos:
1. Copia el valor de `email_encrypted`
2. En la consola del navegador de tu curriculum:
```javascript
// En la consola del navegador (F12)
decryptData('el_valor_encriptado_aqui')
```

### Ver Estadísticas

```sql
-- Solicitudes por día
SELECT * FROM access_requests_stats;

-- Total de solicitudes
SELECT COUNT(*) FROM access_requests;

-- Solicitudes últimas 24 horas
SELECT COUNT(*) 
FROM access_requests 
WHERE requested_at > NOW() - INTERVAL '24 hours';

-- Solicitudes por estado
SELECT status, COUNT(*) 
FROM access_requests 
GROUP BY status;
```

---

## 📊 Dashboard de Estadísticas (Opcional)

Puedes crear queries guardadas en Supabase:

### Query: Resumen Semanal

```sql
SELECT 
    DATE_TRUNC('week', requested_at) as semana,
    COUNT(*) as total_solicitudes,
    COUNT(DISTINCT email_hash) as emails_unicos
FROM access_requests
WHERE requested_at > NOW() - INTERVAL '4 weeks'
GROUP BY semana
ORDER BY semana DESC;
```

### Query: Tendencias por Hora

```sql
SELECT 
    EXTRACT(HOUR FROM requested_at) as hora,
    COUNT(*) as solicitudes
FROM access_requests
WHERE requested_at > NOW() - INTERVAL '7 days'
GROUP BY hora
ORDER BY hora;
```

---

## 🧹 Mantenimiento

### Limpiar Solicitudes Antiguas (>90 días)

En SQL Editor:

```sql
SELECT cleanup_old_requests();
```

Esto eliminará automáticamente solicitudes de más de 90 días.

### Backup Manual

1. **Table Editor** → `access_requests`
2. Click en **"..."** (menú)
3. **Export as CSV**
4. Guarda el archivo

---

## 🔐 Seguridad

### Row Level Security (RLS)

✅ **Habilitado automáticamente** por el script

**Políticas aplicadas:**
- ✅ Cualquiera puede **insertar** solicitudes (anon)
- ✅ Solo usuarios **autenticados** pueden **leer** datos
- ❌ Nadie puede **actualizar** o **eliminar** sin autenticar

### Autenticación para Ver Datos

Si quieres acceso completo a los datos:

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **Add User** → Crea un usuario con tu email
3. Usa ese usuario para autenticarte y ver datos

**O simplemente usa el Table Editor en Supabase** (ya estás autenticado en el dashboard).

---

## ❌ Troubleshooting

### Error: "relation access_requests does not exist"

**Solución**: El script SQL no se ejecutó correctamente.
- Ve a SQL Editor
- Ejecuta el script completo de `supabase-schema.sql`

### Error: "new row violates row-level security"

**Solución**: Las políticas RLS están bloqueando.
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'access_requests';

-- Recrear política de INSERT
DROP POLICY IF EXISTS "Cualquiera puede insertar solicitudes" ON access_requests;
CREATE POLICY "Cualquiera puede insertar solicitudes"
    ON access_requests FOR INSERT WITH CHECK (true);
```

### No veo datos en la tabla

**Verificaciones:**
1. ¿Configuraste `enabled: true` en `supabase-config.js`?
2. ¿Subiste los cambios a GitHub?
3. ¿Coolify redesplegó?
4. ¿Hay errores en la consola del navegador (F12)?

### La app sigue usando LocalStorage

**Solución**:
1. Verifica que `SUPABASE_CONFIG.enabled = true`
2. Abre consola (F12) y busca:
   ```
   ✅ Supabase inicializado correctamente
   ```
3. Si ves errores, verifica que las credenciales sean correctas

---

## 📈 Mejoras Futuras

### Dashboard Web de Estadísticas

Puedes crear una página HTML simple que muestre estadísticas:

```html
<!-- stats.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Stats - Curriculum</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <h1>Estadísticas de Solicitudes</h1>
    <div id="stats"></div>
    
    <script>
        const supabase = supabase.createClient(
            'TU_URL',
            'TU_SERVICE_ROLE_KEY' // ⚠️ Nunca uses service_role en frontend público
        );
        
        async function loadStats() {
            const { data } = await supabase
                .from('access_requests_stats')
                .select('*');
            
            document.getElementById('stats').innerHTML = 
                JSON.stringify(data, null, 2);
        }
        
        loadStats();
    </script>
</body>
</html>
```

### Webhooks

Configura webhooks en Supabase para notificaciones en tiempo real:

1. **Database** → **Database Webhooks**
2. **Create a new webhook**
3. Trigger: `INSERT` en `access_requests`
4. HTTP Request: POST a tu endpoint de notificaciones

---

## 💰 Límites del Plan Gratuito

- ✅ 500 MB de almacenamiento en base de datos
- ✅ 1 GB de transferencia mensual
- ✅ 2 GB de almacenamiento de archivos
- ✅ 50,000 usuarios activos mensuales
- ✅ Social OAuth (GitHub, Google, etc.)

**Para un curriculum personal, es MÁS que suficiente.**

---

## 📞 Soporte

**Documentación Supabase**: https://supabase.com/docs

**Problemas comunes**: https://supabase.com/docs/guides/troubleshooting

**Contacto**:
- Email: bielrivero@gmail.com
- Si tienes dudas con la configuración

---

✅ **¡Ahora tienes una base de datos PostgreSQL profesional, encriptada y escalable para tu curriculum!**
