# Dockerfile para Curriculum Web Interactivo - Optimizado para Coolify
FROM nginx:alpine

# Etiquetas de metadata
LABEL maintainer="Gabriel Rivero Sampol <bielrivero@gmail.com>"
LABEL description="Curriculum web interactivo con autenticación por email"
LABEL version="2.0"

# Crear directorio de trabajo
WORKDIR /usr/share/nginx/html

# Limpiar directorio por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos del sitio web
COPY index-protegido.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/
COPY styles-auth.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY config-email.js /usr/share/nginx/html/

# Copiar archivos multimedia (si existen)
COPY perfil.jpg /usr/share/nginx/html/ 2>/dev/null || echo "perfil.jpg no encontrado"
COPY perfil.mp4 /usr/share/nginx/html/ 2>/dev/null || echo "perfil.mp4 no encontrado"

# Establecer permisos correctos
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para logs
RUN mkdir -p /var/log/nginx && \
    chmod 755 /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Exponer puerto 80 (Coolify mapeará automáticamente)
EXPOSE 80

# Health check para Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

