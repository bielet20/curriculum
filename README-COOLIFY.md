# 🚀 Guía de Deployment en Coolify

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [Deployment desde Git](#deployment-desde-git)
4. [Configuración en Coolify](#configuración-en-coolify)
5. [Variables de Entorno](#variables-de-entorno)
6. [Dominio y SSL](#dominio-y-ssl)
7. [Verificación](#verificación)
8. [Troubleshooting](#troubleshooting)

---

## 📋 Requisitos Previos

✅ Servidor con Coolify instalado  
✅ Repositorio Git (GitHub, GitLab, Gitea, etc.)  
✅ Cuenta EmailJS configurada  
✅ Dominio apuntando al servidor Coolify (opcional)

---

## ⚙️ Configuración Inicial

### 1. Preparar Repositorio Git

```bash
cd "/Applications/web curriculum proyecto"

# Inicializar Git (si no está ya)
git init

# Añadir todos los archivos
git add .

# Commit inicial
git commit -m "Deploy: Curriculum web con autenticación por email"

# Añadir remote (usa tu URL)
git remote add origin https://github.com/TU_USUARIO/curriculum-web.git

# Push
git branch -M main
git push -u origin main
```

### 2. Archivos Importantes

Verifica que estos archivos estén en el repo:
```
✅ Dockerfile
✅ nginx.conf
✅ index-protegido.html
✅ styles.css
✅ styles-auth.css
✅ script.js
✅ config-email.js
✅ .dockerignore
✅ .env.example
```

---

## 🎯 Deployment desde Git

### Opción 1: Repositorio Público

1. **En Coolify Dashboard**
   - Click en **"+ New"** → **"Resource"**
   - Selecciona **"Application"**

2. **Source Type**
   - Selecciona **"Public Repository"**
   - Pega URL: `https://github.com/TU_USUARIO/curriculum-web.git`
   - Branch: `main`

3. **Build Configuration**
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `./Dockerfile`
   - **Port**: `80`

### Opción 2: Repositorio Privado

1. **Conectar Git Provider**
   - Settings → **Git Sources** → **Add Source**
   - Conecta GitHub/GitLab con OAuth

2. **Crear Aplicación**
   - **+ New** → **Application**
   - Selecciona tu repositorio
   - Branch: `main`
   - Build Pack: `Dockerfile`

---

## 🔧 Configuración en Coolify

### Settings de la Aplicación

**General:**
- **Name**: `curriculum-web`
- **Description**: `Curriculum interactivo Gabriel Rivero`
- **Port Mappings**: `80` (automático)

**Domains:**
- Click **"Add Domain"**
- Introduce: `curriculum.tudominio.com` o deja que Coolify asigne uno
- **SSL**: Automático con Let's Encrypt ✅

**Health Check:**
```
Path: /
Port: 80
Interval: 30s
Timeout: 3s
Retries: 3
```

---

## 🔐 Variables de Entorno

**Importante**: Las credenciales de EmailJS están en `config-email.js` (archivo público en el repo).

Si prefieres mayor seguridad, puedes convertirlas en variables de entorno:

En Coolify → **Environment Variables**:

```bash
# No son necesarias si usas config-email.js directamente
# Solo añade si quieres cambiar la zona horaria
TZ=Europe/Madrid
```

### Para Máxima Seguridad (Opcional)

Si quieres ocultar las credenciales de EmailJS del código:

1. **Modifica `config-email.js`**:
```javascript
const EMAIL_CONFIG = {
    publicKey: window.EMAILJS_PUBLIC_KEY || '5Y4nBn7sGd1rIAXni',
    serviceId: window.EMAILJS_SERVICE_ID || 'service_o2jjdf3',
    templateId: window.EMAILJS_TEMPLATE_ID || 'template_u11j9fj',
    toEmail: window.OWNER_EMAIL || 'bielrivero@gmail.com'
};
```

2. **En Coolify → Environment Variables**:
```
EMAILJS_PUBLIC_KEY=5Y4nBn7sGd1rIAXni
EMAILJS_SERVICE_ID=service_o2jjdf3
EMAILJS_TEMPLATE_ID=template_u11j9fj
OWNER_EMAIL=bielrivero@gmail.com
```

---

## 🌐 Dominio y SSL

### Configurar Dominio Personalizado

1. **En tu Proveedor DNS** (Cloudflare, Namecheap, etc.):
   ```
   Tipo: A
   Name: curriculum (o @)
   Value: IP_DE_TU_SERVIDOR_COOLIFY
   TTL: Auto
   ```

2. **En Coolify**:
   - Application → **Domains**
   - **Add Domain**: `curriculum.tudominio.com`
   - **Generate SSL**: Automático (Let's Encrypt)
   - Espera 1-2 minutos para propagación

3. **Verificar SSL**:
   ```bash
   curl -I https://curriculum.tudominio.com
   ```

### Dominio de Coolify (Temporal)

Coolify asigna automáticamente:
```
https://tu-app-xxxxx.coolify.example.com
```

---

## ✅ Verificación

### 1. Build Exitoso

En Coolify → **Deployments**:
```
✅ Building image...
✅ Image built successfully
✅ Starting container...
✅ Container running
✅ Health check passed
```

### 2. Logs

```bash
# Ver logs en tiempo real
Coolify Dashboard → Application → Logs

# Buscar:
✅ "nginx: configuration file ... test is successful"
✅ "start worker process"
```

### 3. Acceso Web

```bash
# Abrir en navegador
https://tu-dominio.com

# O el dominio temporal de Coolify
https://tu-app.coolify.example.com
```

Deberías ver:
✅ Pantalla de solicitud de acceso  
✅ Campo para introducir email  
✅ Botón "Solicitar Acceso"

### 4. Probar Sistema de Email

1. Introduce tu email
2. Click en "Solicitar Acceso"
3. Revisa consola del navegador (F12):
   ```
   🔑 ENLACE DE ACCESO (válido 24h):
   https://tu-dominio.com?token=xxx
   ```
4. Revisa tu bandeja de email
5. Click en el enlace
6. ✅ Deberías ver el curriculum completo

---

## 🔄 Actualizar la Aplicación

```bash
# En tu máquina local
git add .
git commit -m "Update: cambios en curriculum"
git push origin main

# En Coolify
# La aplicación se redesplegará automáticamente si tienes Auto Deploy activado
# O click manual en "Deploy" en el dashboard
```

**Auto Deploy:**
- Coolify → Application → **Settings** → **Auto Deploy**: ON
- Cada push a `main` redesplegará automáticamente

---

## 🐛 Troubleshooting

### Error: "Build Failed"

**Síntomas**: Build falla en Coolify

**Solución**:
```bash
# Verificar Dockerfile localmente
docker build -t curriculum-test .

# Si funciona local, revisar logs en Coolify
```

### Error: "Container Not Starting"

**Síntomas**: Container se detiene inmediatamente

**Solución**:
```bash
# En Coolify Logs buscar:
nginx: [emerg] ...

# Verificar nginx.conf
docker run --rm -it curriculum-test nginx -t
```

### Error: "Health Check Failed"

**Síntomas**: Container arranca pero health check falla

**Solución**:
```bash
# En Coolify → Application → Settings
# Desactiva temporalmente Health Check
# O aumenta timeout a 10s
```

### Error: "502 Bad Gateway"

**Síntomas**: Dominio muestra error 502

**Solución**:
```bash
# Verificar puerto en Coolify
Port Mappings: 80 → 80

# Verificar container running
docker ps | grep curriculum
```

### Email No Se Envía

**Síntomas**: Error al solicitar acceso

**Solución**:
1. Abre consola del navegador (F12)
2. Copia el enlace mágico que aparece
3. Pégalo en la barra de direcciones
4. Verifica configuración EmailJS
5. Revisa template existe: `template_u11j9fj`

### SSL No Funciona

**Síntomas**: Certificado inválido o HTTP en vez de HTTPS

**Solución**:
```bash
# Verificar DNS apunta a Coolify
dig curriculum.tudominio.com

# Regenerar SSL en Coolify
Application → Domains → "Regenerate SSL"

# Esperar 2-3 minutos
```

---

## 📊 Monitoreo

### Métricas en Coolify

- **CPU Usage**: Debería estar < 5% (sitio estático)
- **Memory**: ~10-20 MB (nginx alpine)
- **Network**: Depende del tráfico

### Ver Estadísticas

```bash
# En el servidor Coolify
docker stats curriculum-web

# Logs en tiempo real
docker logs -f curriculum-web
```

---

## 🎨 Personalización Post-Deploy

### Actualizar Credenciales EmailJS

```bash
# Editar config-email.js
# Commit y push
git add config-email.js
git commit -m "Update: EmailJS credentials"
git push origin main

# Coolify redesplegará automáticamente
```

### Cambiar Duración de Tokens

```bash
# Editar script.js línea 8
tokenDuration: 48 * 60 * 60 * 1000, // 48 horas

# Commit y push
git add script.js
git commit -m "Update: token duration to 48h"
git push origin main
```

### Añadir Archivos Multimedia

```bash
# Añadir perfil.mp4 y perfil.jpg
git add perfil.mp4 perfil.jpg
git commit -m "Add: multimedia files"
git push origin main
```

---

## 🚀 Optimizaciones Avanzadas

### CDN con Cloudflare

1. **Añadir sitio a Cloudflare**
2. **DNS**: Modo proxy (naranja)
3. **SSL**: Full (Strict)
4. **Cache**: Estándar
5. **Minify**: HTML, CSS, JS

### Backup Automático

Coolify incluye backups automáticos:
- **Settings** → **Backups** → **Enable**
- Frecuencia: Diaria
- Retención: 7 días

### Monitoreo Externo

```bash
# UptimeRobot, Pingdom, etc.
Monitor URL: https://curriculum.tudominio.com
Interval: 5 minutos
```

---

## 📞 Soporte

**Documentación Coolify**: https://coolify.io/docs

**Logs de Debug**:
```bash
# SSH al servidor Coolify
ssh root@tu-servidor

# Ver logs
cd /data/coolify
docker-compose logs -f
```

**Contacto**:
- Gabriel Rivero Sampol
- Email: bielrivero@gmail.com
- Tel: 678 528 138

---

## ✨ Checklist Final

Antes de ir a producción:

- [ ] Repository en Git pushed
- [ ] EmailJS configurado y probado
- [ ] DNS apuntando al servidor Coolify
- [ ] SSL activo y válido
- [ ] Sistema de emails funcionando
- [ ] Enlace mágico probado
- [ ] Acceso al curriculum verificado
- [ ] Logs sin errores
- [ ] Health check pasando
- [ ] Auto deploy configurado
- [ ] Backups activados

---

🎉 **¡Listo para producción!**

Tu curriculum estará disponible en: `https://curriculum.tudominio.com`

El sistema de autenticación por email funcionará automáticamente con los enlaces mágicos válidos por 24 horas.
