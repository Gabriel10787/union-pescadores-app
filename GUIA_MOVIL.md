# 📱 Guía de Instalación y Uso Móvil - UPP

## 🚀 Instalación en Dispositivos Móviles

### 📱 Android (Chrome/Edge)

1. **Abre la aplicación** en el navegador Chrome o Edge
2. En el menú del navegador (⋮), busca **"Añadir a pantalla de inicio"** o **"Instalar aplicación"**
3. Confirma la instalación
4. El icono de la app aparecerá en tu pantalla de inicio
5. La app funcionará **sin conexión** una vez instalada

### 🍎 iOS (Safari)

1. **Abre la aplicación** en Safari
2. Pulsa el botón de **Compartir** (□↑)
3. Desplázate y selecciona **"Añadir a pantalla de inicio"**
4. Confirma y personaliza el nombre si quieres
5. La app funcionará **sin conexión** una vez instalada

---

## 👥 Modo Multiusuario - Trabajo por Zonas

### 🎯 Escenario: Varios pesadores trabajando en diferentes zonas

La aplicación ahora incluye un **"Modo Zona"** que facilita el trabajo cuando múltiples personas están registrando pesajes simultáneamente.

### ✅ Configuración Recomendada:

#### **Opción 1: Varios dispositivos SIN conexión entre ellos**

**✨ Lo que necesitas:**
- Varios móviles/tablets con la app instalada
- Cada dispositivo trabajará de forma independiente

**📋 Proceso:**

1. **ANTES del concurso (con internet):**
   - Abre la app en todos los dispositivos
   - Crea el concurso con la fecha y temporada
   - Configura todas las zonas necesarias
   - Asegúrate de que todos los dispositivos tengan el mismo concurso creado

2. **Durante el concurso (sin internet):**
   - Cada persona abre la app en su dispositivo
   - **Activa el "Modo Zona"**:
     - Ve a la sección "🎯 Modo Zona (Multiusuario)"
     - Selecciona tu zona asignada (ej: Zona A)
     - Pulsa "✅ Activar modo zona"
   - Ahora la zona quedará **fija** y no tendrás que seleccionarla en cada pesaje
   - Registra los pesajes rápidamente (solo nombre, puesto y peso)

3. **DESPUÉS del concurso (con internet):**
   - Reúne todos los dispositivos
   - En un ordenador, crea el mismo concurso
   - Exporta los datos de cada móvil a Excel
   - Combina los datos manualmente en Excel
   - Importa el resultado final (o cópialos manualmente)

#### **Opción 2: Compartir un solo dispositivo**

Si prefieres usar un solo dispositivo para todas las zonas:
- No actives el modo zona
- Selecciona manualmente la zona en cada pesaje
- Todos los datos quedarán en un mismo dispositivo

---

## 🌐 Opción 3: Trabajo Multiusuario EN TIEMPO REAL (Próxima implementación)

Para sincronización en tiempo real entre dispositivos necesitarás:

### 🔧 Requisitos técnicos:
- Un servidor con base de datos (MySQL/PostgreSQL)
- API REST o WebSockets
- Conexión a internet durante el concurso

### 💡 Ventajas:
- ✅ Todos ven los datos actualizados al instante
- ✅ No hay que combinar datos después
- ✅ Clasificación en vivo
- ✅ Evita duplicados automáticamente

### ⚠️ Desventajas:
- ❌ Requiere conexión a internet continua
- ❌ Necesita servidor y desarrollo adicional
- ❌ Coste de hosting del servidor

---

## 📊 Recomendación según tu caso:

### 🎣 **Pesca en zonas SIN cobertura móvil:**
✅ **Usa la app PWA offline con "Modo Zona"**
- Cada pesador con su móvil y su zona fija
- Combina los datos al final del día
- Cero dependencia de internet

### 🎣 **Pesca en zonas CON buena cobertura:**
✅ **Considera implementar sincronización online** (próxima fase)
- Datos en tiempo real
- Clasificación actualizada al instante
- Requiere servidor

---

## 💡 Consejos para Trabajo Multiusuario Offline:

1. **Nombra los dispositivos**: Pon una etiqueta en cada móvil/tablet con su zona asignada

2. **Backup preventivo**: 
   - Exporta a Excel regularmente
   - Usa el botón "📤 Exportar" frecuentemente

3. **Convención de nombres**: 
   - Acuerda cómo escribir los nombres (con/sin apellidos, mayúsculas, etc.)
   - Evita duplicados con nombres similares

4. **Reunión final**: 
   - Reserva 30 minutos al final para combinar datos
   - Usa Excel para fusionar las exportaciones

5. **Batería**: 
   - Carga todos los dispositivos antes del concurso
   - Lleva powerbanks de respaldo

---

## 🔍 Solución de Problemas:

### ❓ "La app no funciona sin internet"
- Asegúrate de haberla abierto AL MENOS UNA VEZ con internet
- El service worker necesita cachear los archivos la primera vez

### ❓ "Los datos desaparecieron"
- Los datos están en localStorage del navegador
- NO borres datos del navegador ni uses modo incógnito
- Exporta regularmente a Excel como backup

### ❓ "La zona fija no se queda seleccionada"
- Verifica que has pulsado "✅ Activar modo zona"
- Debe aparecer el mensaje verde "🟢 Modo Zona Activo"

### ❓ "El botón de instalar no aparece"
- Verifica que usas Chrome/Edge (Android) o Safari (iOS)
- Algunos navegadores no soportan PWA
- Intenta añadir marcador y úsalo desde ahí

---

## 📞 Soporte:

Para dudas o problemas, contacta con el desarrollador.

**Versión:** 2.0 - PWA con Modo Multiusuario
**Fecha:** Enero 2026
