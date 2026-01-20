// ========================================
// 🎯 GUÍA DE INICIO RÁPIDO
// ========================================

/*
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ✨ ¡Bienvenido a tu Curriculum Protegido! ✨              │
│                                                             │
│   Este sistema de seguridad protege tu curriculum con      │
│   una contraseña que se renueva automáticamente cada       │
│   24 horas.                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘


📋 PASOS PARA EMPEZAR:

1️⃣  Abre tu navegador en: http://localhost:8000

2️⃣  Verás un modal pidiendo contraseña

3️⃣  Abre la consola del navegador:
    - Windows/Linux: F12 o Ctrl+Shift+J
    - Mac: Cmd+Option+J

4️⃣  Escribe este comando y presiona Enter:
    
    obtenerContraseñaHoy()

5️⃣  Copia la contraseña (8 caracteres) que aparece

6️⃣  Pégala en el modal y haz clic en "Acceder"

7️⃣  ¡Listo! Ya puedes ver tu curriculum


─────────────────────────────────────────────────────────────

🔐 CONTRASEÑA DE HOY:

Para ver tu contraseña actual, ejecuta en la consola:

    obtenerContraseñaHoy()

Ejemplo de salida:
╔═══════════════════════════════════════╗
║   🔐 CONTRASEÑA DE HOY                ║
╠═══════════════════════════════════════╣
║   Contraseña: AB3X7K9Q                ║
║   Fecha: 20/01/2026                   ║
║   Válida por: 24 horas                ║
╚═══════════════════════════════════════╝


─────────────────────────────────────────────────────────────

📧 CONFIGURAR NOTIFICACIONES POR EMAIL:

Para recibir emails cuando alguien solicite acceso:

1. Regístrate en https://www.emailjs.com/
2. Crea un servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email
4. Edita el archivo: config-email.js

Reemplaza:
    publicKey: 'TU_PUBLIC_KEY_AQUI'
    serviceId: 'TU_SERVICE_ID'
    templateId: 'TU_TEMPLATE_ID'
    toEmail: 'tu-email@ejemplo.com'

Por tus datos reales de EmailJS.


─────────────────────────────────────────────────────────────

🎮 COMANDOS ÚTILES EN LA CONSOLA:

// Ver todos los comandos disponibles
ayuda()

// Ver contraseña actual
obtenerContraseñaHoy()

// Ver quién ha intentado acceder
verLogAccesos()

// Ver solicitudes de acceso
verSolicitudes()

// Ver información de tu sesión
infoSesion()

// Ver estadísticas generales
estadisticas()

// Ver contraseñas de los próximos 7 días
verContraseñasFuturas(7)

// Cerrar sesión
auth.logout()


─────────────────────────────────────────────────────────────

🔒 CÓMO FUNCIONA:

1. GENERACIÓN DE CONTRASEÑA:
   - Se genera automáticamente cada día a las 00:00
   - Usa la fecha + una semilla secreta
   - Resultado: 8 caracteres alfanuméricos

2. ACCESO CON CONTRASEÑA:
   Usuario ingresa contraseña → Se valida → Acceso por 24 horas

3. SOLICITUD SIN CONTRASEÑA:
   Usuario ingresa email → Tú recibes notificación → 
   Decides si compartir contraseña


─────────────────────────────────────────────────────────────

⚙️ PERSONALIZACIÓN:

1. Cambiar semilla secreta (auth.js, línea 14):
   const secretSeed = 'MI_FRASE_SECRETA_ÚNICA';

2. Cambiar tu email (auth.js, línea 8):
   this.adminEmail = 'tu-email-real@gmail.com';

3. Cambiar tiempo de sesión (auth.js, línea 53):
   const twentyFourHours = 24 * 60 * 60 * 1000;
   // Cambia 24 por las horas que quieras


─────────────────────────────────────────────────────────────

❓ PREGUNTAS FRECUENTES:

P: ¿Cómo comparto mi curriculum con alguien?
R: Simplemente comparte la contraseña del día. Usa:
   obtenerContraseñaHoy()

P: ¿La contraseña cambia automáticamente?
R: Sí, cada día a las 00:00 se genera una nueva.

P: ¿Puedo ver contraseñas futuras?
R: Sí, usa: verContraseñasFuturas(7)

P: ¿Cómo sé quién ha intentado acceder?
R: Usa: verLogAccesos()

P: ¿Qué pasa si olvido mi contraseña?
R: No hay problema, abre la consola y ejecuta:
   obtenerContraseñaHoy()

P: ¿Puedo desactivar la seguridad?
R: Sí, comenta el código al final de auth.js
   (líneas 240-250 aproximadamente)


─────────────────────────────────────────────────────────────

📚 DOCUMENTACIÓN COMPLETA:

Para información detallada, consulta:

- INSTRUCCIONES_SEGURIDAD.md → Guía completa de seguridad
- README_NUEVO.md → Información general del proyecto
- config-email.js → Configuración de EmailJS (con ejemplos)


─────────────────────────────────────────────────────────────

🎨 EJEMPLO DE USO:

ESCENARIO 1: Compartir con un reclutador
-----------------------------------------
1. Obtienes contraseña: obtenerContraseñaHoy()
2. Envías email: "Hola, aquí está mi curriculum:
   http://mi-sitio.com
   Contraseña: AB3X7K9Q (válida 24h)"
3. El reclutador accede y revisa tu información

ESCENARIO 2: Alguien solicita acceso
-------------------------------------
1. Visitante ingresa su nombre y email
2. Tú recibes email con:
   - Datos del visitante
   - Contraseña del día
3. Decides si enviarle la contraseña


─────────────────────────────────────────────────────────────

🚀 PRÓXIMOS PASOS:

✅ Obtén tu contraseña con: obtenerContraseñaHoy()
✅ Accede a tu curriculum
✅ Personaliza tu información en index.html
✅ Configura EmailJS en config-email.js
✅ Cambia la semilla secreta en auth.js
✅ Prueba el sistema con diferentes escenarios


─────────────────────────────────────────────────────────────

💡 TIPS PROFESIONALES:

🔹 Cambia la semilla secreta regularmente (cada mes)
🔹 Revisa el log de accesos semanalmente
🔹 No compartas tu semilla secreta con nadie
🔹 Para producción, considera un backend real
🔹 Guarda las contraseñas de la semana en un lugar seguro


─────────────────────────────────────────────────────────────

🎉 ¡LISTO PARA EMPEZAR!

Tu curriculum está protegido y listo para compartir.
Recuerda: la contraseña cambia cada día automáticamente.

Para cualquier duda, abre la consola (F12) y escribe:
    ayuda()


─────────────────────────────────────────────────────────────
*/

console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🎯 Curriculum Protegido - Sistema Iniciado          ║
║                                                        ║
║   Escribe: ayuda() para ver comandos disponibles      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
`);
