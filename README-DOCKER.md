# 🐳 Despliegue con Docker - Curriculum Gabriel Rivero Sampol

Guía completa para desplegar tu curriculum web usando Docker.

## 📋 Prerequisitos

- Docker instalado ([Descargar Docker](https://www.docker.com/get-started))
- Docker Compose instalado (viene con Docker Desktop)

## 🚀 Inicio Rápido

### 1. Construir y ejecutar con Docker Compose (Recomendado)

```bash
# Navegar a la carpeta del proyecto
cd "/Applications/web curriculum proyecto"

# Construir y ejecutar
docker-compose up -d
```

Tu curriculum estará disponible en: **http://localhost:8080**

### 2. Usando Docker directamente

```bash
# Construir la imagen
docker build -t curriculum-gabriel-rivero .

# Ejecutar el contenedor
docker run -d -p 8080:80 --name curriculum curriculum-gabriel-rivero
```

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Detener el contenedor
docker-compose down

# Reiniciar el contenedor
docker-compose restart

# Reconstruir la imagen después de cambios
docker-compose up -d --build
```

### Gestión sin Docker Compose

```bash
# Ver contenedores
docker ps -a

# Ver logs
docker logs curriculum

# Detener contenedor
docker stop curriculum

# Iniciar contenedor
docker start curriculum

# Eliminar contenedor
docker rm curriculum

# Ver imágenes
docker images
```

## 📁 Estructura de Archivos Docker

```
curriculum proyecto/
│
├── Dockerfile              # Definición de la imagen Docker
├── docker-compose.yml      # Orquestación de servicios
├── nginx.conf             # Configuración de Nginx
├── .dockerignore          # Archivos excluidos del build
│
├── index-protegido.html   # Tu curriculum (→ index.html en producción)
├── styles.css
├── styles-auth.css
├── script.js
├── config-email.js
├── perfil.jpg
└── perfil.mp4
```

## 🌐 Desplegar en Producción

### Opción 1: Servidor Propio con Docker

1. **Conectar por SSH a tu servidor:**
   ```bash
   ssh usuario@tu-servidor.com
   ```

2. **Clonar o copiar los archivos:**
   ```bash
   scp -r "/Applications/web curriculum proyecto" usuario@tu-servidor.com:/home/usuario/
   ```

3. **En el servidor, ejecutar:**
   ```bash
   cd /home/usuario/web\ curriculum\ proyecto
   docker-compose up -d
   ```

4. **Configurar dominio** (opcional):
   - Apuntar tu dominio a la IP del servidor
   - Configurar puerto 80 en lugar de 8080 en `docker-compose.yml`

### Opción 2: Docker Hub (Compartir la Imagen)

1. **Crear cuenta en [Docker Hub](https://hub.docker.com/)**

2. **Construir y etiquetar la imagen:**
   ```bash
   docker build -t tuusuario/curriculum-gabriel-rivero:latest .
   ```

3. **Login en Docker Hub:**
   ```bash
   docker login
   ```

4. **Subir la imagen:**
   ```bash
   docker push tuusuario/curriculum-gabriel-rivero:latest
   ```

5. **En cualquier servidor, descargar y ejecutar:**
   ```bash
   docker pull tuusuario/curriculum-gabriel-rivero:latest
   docker run -d -p 80:80 tuusuario/curriculum-gabriel-rivero:latest
   ```

### Opción 3: Servicios Cloud

#### Railway.app (Gratis/Fácil)
1. Registrarse en [Railway](https://railway.app/)
2. Conectar tu repositorio GitHub
3. Railway detectará automáticamente el Dockerfile
4. Obtendrás una URL pública automáticamente

#### Render.com (Gratis)
1. Registrarse en [Render](https://render.com/)
2. Crear nuevo "Web Service"
3. Conectar repositorio
4. Render construirá y desplegará automáticamente

#### DigitalOcean App Platform
1. Crear cuenta en [DigitalOcean](https://www.digitalocean.com/)
2. App Platform → Create App
3. Conectar repositorio con el Dockerfile
4. Despliegue automático

## 🔒 HTTPS y Dominio Personalizado

### Con Nginx Proxy Manager (Recomendado)

1. **Instalar Nginx Proxy Manager:**
   ```bash
   docker run -d \
     --name nginx-proxy-manager \
     -p 80:80 \
     -p 443:443 \
     -p 81:81 \
     jc21/nginx-proxy-manager
   ```

2. **Acceder a http://tu-servidor:81**
   - Email: `admin@example.com`
   - Password: `changeme`

3. **Configurar Proxy Host:**
   - Domain: `curriculum.tudominio.com`
   - Forward to: `curriculum-gabriel-rivero:80`
   - SSL: Solicitar certificado Let's Encrypt automático

### Con Traefik

Ejemplo de `docker-compose.yml` con Traefik:

```yaml
version: '3.8'

services:
  curriculum-web:
    build: .
    container_name: curriculum-gabriel-rivero
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.curriculum.rule=Host(`curriculum.tudominio.com`)"
      - "traefik.http.routers.curriculum.entrypoints=websecure"
      - "traefik.http.routers.curriculum.tls.certresolver=myresolver"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

## 🔧 Personalización

### Cambiar Puerto

Edita `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Cambia 8080 por el puerto que quieras
```

### Montar Archivos en Desarrollo

Descomenta en `docker-compose.yml`:
```yaml
volumes:
  - ./index-protegido.html:/usr/share/nginx/html/index.html:ro
  - ./styles.css:/usr/share/nginx/html/styles.css:ro
  - ./script.js:/usr/share/nginx/html/script.js:ro
```

Esto permite editar archivos sin reconstruir la imagen.

### Variables de Entorno

Agrega en `docker-compose.yml`:
```yaml
environment:
  - TZ=Europe/Madrid
  - CUSTOM_VAR=value
```

## 📊 Monitoreo y Logs

### Ver Logs del Contenedor
```bash
# Últimas 100 líneas
docker-compose logs --tail=100

# En tiempo real
docker-compose logs -f

# Solo de nginx
docker exec curriculum-gabriel-rivero tail -f /var/log/nginx/access.log
```

### Estadísticas de Uso
```bash
# Ver uso de recursos
docker stats curriculum-gabriel-rivero

# Inspeccionar contenedor
docker inspect curriculum-gabriel-rivero
```

## 🔄 Actualizar la Aplicación

### Después de hacer cambios:

```bash
# 1. Detener el contenedor
docker-compose down

# 2. Reconstruir la imagen
docker-compose build

# 3. Iniciar de nuevo
docker-compose up -d
```

O en un solo comando:
```bash
docker-compose up -d --build
```

## 🧹 Limpieza

### Eliminar todo:
```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar imagen
docker rmi curriculum-gabriel-rivero

# Limpiar todo Docker (¡cuidado!)
docker system prune -a
```

## 🐛 Solución de Problemas

### El contenedor no inicia:
```bash
# Ver logs detallados
docker-compose logs

# Verificar estado
docker-compose ps
```

### Puerto ya en uso:
```bash
# Ver qué usa el puerto 8080
lsof -i :8080

# Cambiar puerto en docker-compose.yml
```

### Archivos no se actualizan:
```bash
# Reconstruir forzando sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Verificar que nginx está funcionando:
```bash
# Acceder al contenedor
docker exec -it curriculum-gabriel-rivero sh

# Ver configuración de nginx
cat /etc/nginx/conf.d/default.conf

# Ver archivos servidos
ls -la /usr/share/nginx/html/
```

## 📦 Optimizaciones para Producción

### 1. Multi-stage Build (Opcional)

Para proyectos más grandes, usa multi-stage:

```dockerfile
# Stage 1: Build (si tuvieras compilación)
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Producción
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 2. Reducir Tamaño de Imagen

```dockerfile
# Ya usamos nginx:alpine (muy ligera)
# Eliminar archivos innecesarios en el build
RUN rm -rf /var/cache/apk/*
```

### 3. Health Check

Agrega en `Dockerfile`:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

## 📝 Checklist de Despliegue

- [ ] Video `perfil.mp4` añadido
- [ ] Contraseña cambiada en `script.js`
- [ ] Correos actualizados
- [ ] Construir imagen: `docker-compose build`
- [ ] Probar localmente: `docker-compose up`
- [ ] Verificar en http://localhost:8080
- [ ] Configurar dominio y SSL
- [ ] Configurar backups automáticos
- [ ] Monitorear logs

## 🎯 URLs de Acceso

- **Local:** http://localhost:8080
- **Producción:** Según tu configuración
- **Contraseña:** curriculum2026 (¡cámbiala!)

---

**¿Preguntas o problemas?**
Revisa la documentación de [Docker](https://docs.docker.com/) o consulta los logs del contenedor.

🚀 **¡Tu curriculum está listo para producción!**
