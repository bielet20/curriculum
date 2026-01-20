# ⚡ Quick Start - Coolify Deployment

## 🎯 Pasos Rápidos (5 minutos)

### 1️⃣ Sube el código a Git

```bash
cd "/Applications/web curriculum proyecto"

# Inicializar Git
git init

# Añadir archivos
git add .

# Commit
git commit -m "Deploy: curriculum web con autenticación email"

# Añadir remote (cambia por tu URL)
git remote add origin https://github.com/TUUSUARIO/curriculum-web.git

# Push
git branch -M main
git push -u origin main
```

### 2️⃣ En Coolify Dashboard

1. **+ New** → **Application**
2. **Source**: Public/Private Repository
3. **Repository URL**: `https://github.com/TUUSUARIO/curriculum-web.git`
4. **Branch**: `main`
5. **Build Pack**: `Dockerfile`
6. **Port**: `80`
7. **Deploy** ✅

### 3️⃣ Dominio (opcional)

**En Coolify:**
- Application → **Domains** → **Add Domain**
- Introduce: `curriculum.tudominio.com`
- SSL: Automático ✅

**En tu DNS:**
```
Tipo: A
Name: curriculum
Value: IP_DEL_SERVIDOR_COOLIFY
```

## ✅ Verificación

Accede a: `https://curriculum.tudominio.com`

Deberías ver:
- ✅ Pantalla de solicitud de acceso
- ✅ Campo para email
- ✅ Sistema de enlaces mágicos funcionando

## 🔑 Configuración EmailJS

Las credenciales ya están en `config-email.js`:
```javascript
publicKey: '5Y4nBn7sGd1rIAXni'
serviceId: 'service_o2jjdf3'
templateId: 'template_u11j9fj'
```

## 📁 Archivos Listos

✅ Dockerfile (optimizado para Coolify)
✅ nginx.conf (con gzip y cache)
✅ index-protegido.html (pantalla de login)
✅ script.js (sistema de tokens)
✅ config-email.js (EmailJS configurado)
✅ .dockerignore
✅ .env.example
✅ README-COOLIFY.md (guía completa)

## 🚀 Auto Deploy

En Coolify:
- Settings → **Auto Deploy**: ON
- Cada `git push` redesplegará automáticamente

## 💡 Tips

**Ver logs en tiempo real:**
```
Coolify → Application → Logs
```

**Probar enlace mágico:**
1. Introduce tu email
2. Abre consola del navegador (F12)
3. Copia el enlace que aparece
4. Pégalo en nueva pestaña
5. ✅ Acceso concedido

**Actualizar código:**
```bash
git add .
git commit -m "Update: cambios"
git push
# Coolify redespliega automáticamente
```

## 📞 Soporte

**Documentación completa**: [README-COOLIFY.md](README-COOLIFY.md)

**Issues comunes**: Sección Troubleshooting en README-COOLIFY.md

---

🎉 **¡Listo en 5 minutos!**
