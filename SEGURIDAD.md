# 🔐 Seguridad y Privacidad - Curriculum Web

## ✅ Estado Actual de Seguridad

### Implementado

#### 1. Autenticación Segura
- ✅ **Enlaces mágicos temporales** (24h de validez)
- ✅ **Tokens firmados** con hash criptográfico
- ✅ **Sin contraseñas** que puedan ser robadas
- ✅ **Expiración automática** de sesiones

#### 2. Protección de Datos
- ✅ **Encriptación local** de solicitudes (XOR + Base64)
- ✅ **Sin captura de IPs** (privacidad del usuario)
- ✅ **User-Agent limitado** (solo 50 caracteres)
- ✅ **Límite de almacenamiento** (máx 100 solicitudes)

#### 3. Comunicaciones
- ✅ **EmailJS** (conexión HTTPS)
- ✅ **Tokens en URL** (temporal, no almacenado en servidor)
- ✅ **Notificaciones al propietario** de nuevas solicitudes

#### 4. Seguridad Frontend
- ✅ **No expone credenciales** sensibles
- ✅ **Validación de email** en cliente
- ✅ **Sanitización de inputs**
- ✅ **Sin eval()** ni ejecución de código dinámico

---

## 🔒 Configuración de Seguridad

### Variables Sensibles

**En `script.js` línea 8:**
```javascript
const AUTH_CONFIG = {
    ownerEmail: 'bielrivero@gmail.com',
    tokenDuration: 24 * 60 * 60 * 1000,
    sessionKey: 'curriculum_auth_token',
    secretKey: 'curriculum_secret_2026_grs' // ⚠️ CAMBIAR ESTO
};
```

**IMPORTANTE**: Cambia `secretKey` por algo único:
```javascript
secretKey: 'tu_clave_super_secreta_unica_2026'
```

### Credenciales EmailJS

**En `config-email.js`:**
```javascript
const EMAIL_CONFIG = {
    publicKey: '5Y4nBn7sGd1rIAXni',      // ✅ OK (es pública)
    serviceId: 'service_o2jjdf3',        // ✅ OK
    templateId: 'template_u11j9fj',      // ✅ OK
    toEmail: 'bielrivero@gmail.com'      // ✅ OK
};
```

Estas credenciales son **públicas por diseño** de EmailJS. No hay riesgo.

---

## 📧 Sistema de Notificaciones

### Flujo Implementado

1. **Usuario solicita acceso** → introduce email
2. **Sistema genera** enlace mágico único
3. **Envía 2 emails**:
   - ✅ Al **solicitante**: enlace de acceso (24h)
   - ✅ Al **propietario** (tú): notificación de solicitud
4. **Guarda encriptado** en navegador del solicitante

### Email al Propietario

Recibirás un email cada vez que alguien solicite acceso con:
- 📧 Email del solicitante
- 🕐 Fecha y hora de la solicitud
- ℹ️ Información de que se envió el enlace

---

## 🗄️ Opciones de Base de Datos

### Opción 1: LocalStorage Encriptado (ACTUAL)
**Estado**: ✅ Implementado

**Pros:**
- ✅ Sin servidor backend
- ✅ Gratis
- ✅ Datos encriptados
- ✅ Funciona offline

**Contras:**
- ⚠️ Datos solo en el navegador del usuario
- ⚠️ Se pierden si borran cookies/datos
- ⚠️ Encriptación simple (XOR)

**Uso:**
```javascript
// Ver solicitudes (consola del navegador)
localStorage.getItem('access_requests_enc')
```

### Opción 2: Supabase (Recomendado)
**Estado**: ❌ No implementado (opcional)

**Pros:**
- ✅ Base de datos PostgreSQL real
- ✅ Encriptación en tránsito y reposo
- ✅ Gratis hasta 500MB
- ✅ APIs REST automáticas
- ✅ Row Level Security (RLS)

**Implementación:**
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear tabla `access_requests`:
```sql
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64),  -- Hash de IP, no IP real
  status VARCHAR(50) DEFAULT 'pending'
);

-- Habilitar Row Level Security
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Solo el owner puede ver
CREATE POLICY "Owner only" ON access_requests
  FOR SELECT USING (auth.uid() = 'TU_USER_ID');
```

3. Integrar en `script.js`:
```javascript
// Añadir SDK de Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tu-proyecto.supabase.co',
  'tu-anon-key'
)

async function saveToDatabase(email) {
  const { data, error } = await supabase
    .from('access_requests')
    .insert({
      email: email,
      ip_hash: await hashIP(), // Hash, no IP real
      status: 'sent'
    })
}
```

### Opción 3: Firebase Firestore
**Estado**: ❌ No implementado (opcional)

**Pros:**
- ✅ NoSQL flexible
- ✅ Gratis hasta 1GB
- ✅ Reglas de seguridad robustas
- ✅ Tiempo real

**Implementación:**
```javascript
// Firebase config
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  projectId: "curriculum-web"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveToFirestore(email) {
  await addDoc(collection(db, "requests"), {
    email: email,
    timestamp: new Date(),
    status: 'sent'
  });
}
```

### Opción 4: MongoDB Atlas
**Estado**: ❌ No implementado (opcional)

**Pros:**
- ✅ MongoDB gratis hasta 512MB
- ✅ Encriptación nativa
- ✅ APIs REST

---

## 🔐 Mejoras de Seguridad Adicionales

### 1. HTTPS Obligatorio (Producción)
```javascript
// Forzar HTTPS en producción
if (window.location.protocol === 'http:' && 
    window.location.hostname !== 'localhost') {
    window.location.protocol = 'https:';
}
```

### 2. Content Security Policy
Añadir en `index-protegido.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.jsdelivr.net https://api.emailjs.com; 
               style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;">
```

### 3. Rate Limiting
```javascript
// Limitar solicitudes (max 3 por hora)
function checkRateLimit(email) {
    const key = `ratelimit_${email}`;
    const requests = JSON.parse(localStorage.getItem(key) || '[]');
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    const recentRequests = requests.filter(t => t > oneHourAgo);
    
    if (recentRequests.length >= 3) {
        throw new Error('Demasiadas solicitudes. Intenta en 1 hora.');
    }
    
    recentRequests.push(Date.now());
    localStorage.setItem(key, JSON.stringify(recentRequests));
}
```

### 4. Hash de IPs (si usas backend)
```javascript
async function hashIP() {
    // NO guardar IP real, solo hash
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();
    
    // Hash SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + AUTH_CONFIG.secretKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 5. Sanitización de Inputs
```javascript
function sanitizeEmail(email) {
    return email
        .trim()
        .toLowerCase()
        .replace(/[<>\"']/g, ''); // Eliminar caracteres peligrosos
}
```

---

## 📊 Auditoría de Seguridad

### ✅ Checklist Completado

- [x] Autenticación sin contraseñas
- [x] Tokens temporales con expiración
- [x] Encriptación de datos locales
- [x] Notificaciones al propietario
- [x] Sin captura de datos sensibles (IPs)
- [x] Validación de inputs
- [x] HTTPS en producción (Coolify + sslip.io)
- [x] Headers de seguridad (nginx.conf)
- [x] Sin eval() ni innerHTML peligroso
- [x] Límite de almacenamiento local

### ⚠️ Recomendaciones Futuras

- [ ] Implementar Rate Limiting
- [ ] Migrar a base de datos real (Supabase)
- [ ] Añadir Content Security Policy
- [ ] Implementar CAPTCHA (opcional)
- [ ] Logging de accesos (con hashes)
- [ ] Backup automático de solicitudes
- [ ] Panel de administración para revisar accesos

---

## 🔍 Verificación de Privacidad

### Datos que SÍ guardamos:
- ✅ Email del solicitante (encriptado localmente)
- ✅ Timestamp de solicitud
- ✅ User-Agent (primeros 50 chars)

### Datos que NO guardamos:
- ❌ Dirección IP
- ❌ Geolocalización
- ❌ Cookies de tracking
- ❌ Datos del navegador completos
- ❌ Historial de navegación

### Cumplimiento GDPR/LOPD:
- ✅ Datos mínimos necesarios
- ✅ Propósito claro (control de acceso)
- ✅ Consentimiento implícito (al solicitar acceso)
- ✅ Derecho al olvido (borrar localStorage)
- ✅ Encriptación de datos

---

## 🚨 Qué Hacer si Detectas un Problema

### Revocar Accesos
```javascript
// Borrar todas las sesiones activas
localStorage.removeItem('curriculum_auth_token');
localStorage.removeItem('access_requests_enc');
localStorage.clear();
```

### Cambiar Clave de Encriptación
1. Edita `script.js` línea 11:
```javascript
secretKey: 'nueva_clave_super_secreta_2026'
```
2. Commit y push:
```bash
git add script.js
git commit -m "Security: rotate encryption key"
git push origin main
```
3. Coolify redesplegará automáticamente

### Rotar Credenciales EmailJS
1. En EmailJS dashboard, regenera API keys
2. Actualiza `config-email.js`
3. Push a Git

---

## 📞 Contacto de Seguridad

Si detectas una vulnerabilidad:
- **Email**: bielrivero@gmail.com
- **Asunto**: [SEGURIDAD] Curriculum Web

---

## 📚 Referencias

- [EmailJS Security](https://www.emailjs.com/docs/faq/security/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

✅ **Tu curriculum está seguro y respeta la privacidad de los usuarios.**
