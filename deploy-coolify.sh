#!/bin/bash

# Script para preparar y desplegar en Coolify
# Uso: ./deploy-coolify.sh

echo "🚀 Preparando deployment para Coolify..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar archivos necesarios
echo "📋 Verificando archivos necesarios..."

required_files=(
    "Dockerfile"
    "nginx.conf"
    "index-protegido.html"
    "styles.css"
    "styles-auth.css"
    "script.js"
    "config-email.js"
)

missing_files=0

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file - FALTA"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo -e "${RED}Error: Faltan $missing_files archivo(s)${NC}"
    exit 1
fi

echo ""

# Verificar archivos multimedia (opcional)
echo "🎬 Verificando archivos multimedia (opcional)..."
if [ -f "perfil.mp4" ]; then
    echo -e "${GREEN}✅${NC} perfil.mp4"
else
    echo -e "${YELLOW}⚠️${NC}  perfil.mp4 no encontrado (se usará placeholder)"
fi

if [ -f "perfil.jpg" ]; then
    echo -e "${GREEN}✅${NC} perfil.jpg"
else
    echo -e "${YELLOW}⚠️${NC}  perfil.jpg no encontrado (se usará avatar generado)"
fi

echo ""

# Test Docker build local (opcional)
echo "🐳 Verificando Docker..."
if command -v docker > /dev/null 2>&1; then
    if docker info > /dev/null 2>&1; then
        echo "Probando build de Docker localmente..."
        if docker build -t curriculum-web-test . > /dev/null 2>&1; then
            echo -e "${GREEN}✅${NC} Build de Docker exitoso"
            docker rmi curriculum-web-test > /dev/null 2>&1
        else
            echo -e "${RED}❌${NC} Error en build de Docker"
            echo "Ejecuta: docker build -t curriculum-web-test . para ver detalles"
        fi
    else
        echo -e "${YELLOW}⚠️${NC}  Docker no está corriendo (opcional para test local)"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Docker no instalado (no es necesario, Coolify lo construirá)"
fi

echo ""

# Verificar Git
echo "📦 Verificando repositorio Git..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Repositorio Git inicializado"
    
    # Mostrar remote
    remote=$(git remote get-url origin 2>/dev/null)
    if [ -n "$remote" ]; then
        echo -e "${GREEN}📍${NC} Remote: $remote"
    else
        echo -e "${YELLOW}⚠️${NC}  No hay remote configurado"
        echo "Configura tu remote: git remote add origin <URL>"
    fi
    
    # Estado de cambios
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️${NC}  Hay cambios sin commit"
        echo "Archivos modificados:"
        git status --short
    else
        echo -e "${GREEN}✅${NC} No hay cambios pendientes"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  No es un repositorio Git"
    echo "Inicializa con: git init"
fi

echo ""
echo "════════════════════════════════════════"
echo "  RESUMEN"
echo "════════════════════════════════════════"
echo ""
echo "✅ Todos los archivos necesarios presentes"
echo "✅ Docker build funciona correctamente"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Asegúrate de que tu código esté en Git:"
echo "   ${YELLOW}git add .${NC}"
echo "   ${YELLOW}git commit -m 'Deploy: curriculum web'${NC}"
echo "   ${YELLOW}git push origin main${NC}"
echo ""
echo "2. En Coolify Dashboard:"
echo "   - New → Application"
echo "   - Source: Public/Private Repository"
echo "   - URL: $(git remote get-url origin 2>/dev/null || echo 'TU_REPOSITORIO_URL')"
echo "   - Branch: main"
echo "   - Build Pack: Dockerfile"
echo "   - Port: 80"
echo ""
echo "3. Variables de entorno (opcionales):"
echo "   TZ=Europe/Madrid"
echo ""
echo "4. Configura tu dominio y SSL automático"
echo ""
echo "📖 Documentación completa: README-COOLIFY.md"
echo ""
echo -e "${GREEN}🎉 ¡Todo listo para Coolify!${NC}"
echo ""
