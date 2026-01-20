# Dockerfile para Curriculum Web Interactivo - Optimizado para Coolify
FROM nginx:alpine

# Etiquetas de metadata
LABEL maintainer="Gabriel Rivero Sampol <bielrivero@gmail.com>"
LABEL description="Curriculum web interactivo con autenticación por email"
LABEL version="2.1"

# Limpiar configuración y archivos por defecto de nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/conf.d/default.conf

# Copiar archivos del sitio web
COPY index-protegido.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/
COPY styles-auth.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY config-email.js /usr/share/nginx/html/

# Copiar archivos multimedia
COPY perfil.jpg /usr/share/nginx/html/
COPY perfil.mp4 /usr/share/nginx/html/

# Copiar configuración de nginx ANTES de establecer permisos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Establecer permisos correctos
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chown -R nginx:nginx /usr/share/nginx/html

# Verificar configuración de nginx
RUN nginx -t

# Exponer puerto 80
EXPOSE 80

# Iniciar nginx en foreground
CMD ["nginx", "-g", "daemon off;"]

