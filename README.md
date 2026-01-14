# 🎣 Unión de Pescadores de Plasencia - Clasificación

## ✨ Aplicación PWA Optimizada para Móviles

### 🎯 Características Principales

✅ **Totalmente funcional SIN internet**
✅ **Instalable en móviles** (Android e iOS)
✅ **Competición individual Y por equipos**
✅ **Equipos persistentes por temporada**
✅ **Modo Zona para trabajo multiusuario** offline
✅ **Diseño responsive** optimizado para móviles
✅ **Edición y eliminación** de registros
✅ **Exportación a Excel** e impresión
✅ **Rankings con medallas** 🥇🥈🥉
✅ **Menú de gestión centralizado**
✅ **Gestión dinámica de zonas y equipos**

---

## 📱 Instalación Móvil

### Android (Chrome/Edge):
1. Abre la app en el navegador
2. Menú (⋮) → "Añadir a pantalla de inicio"
3. Confirma la instalación
4. ¡Listo! Funciona offline

### iOS (Safari):
1. Abre la app en Safari
2. Botón Compartir (□↑) → "Añadir a pantalla de inicio"
3. Confirma
4. ¡Listo! Funciona offline

📖 **Guía detallada**: Ver [GUIA_MOVIL.md](GUIA_MOVIL.md)

---

## 🤝 Competición por Equipos (NUEVO)

### Equipos a nivel temporada
- **Los equipos son los mismos para toda la temporada**
- Se crean una vez y se usan en todos los concursos
- Cada pescador puede pertenecer a un equipo opcional
- Los pesos de todos los miembros suman para el equipo

### Características:
- **Clasificación individual**: Tabla con medallas 🥇🥈🥉
- **Clasificación por equipos**: Suma de pesos, ranking por concurso
- **Ranking de equipos temporada**: Agregación de todos los concursos
- **Exportación e impresión**: Tablas de equipos completas
- **Gestión centralizada**: Menú de gestión con todos los rankings

📖 **Guía completa de equipos**: Ver [EQUIPOS_GUIA.md](EQUIPOS_GUIA.md)

---

## 📊 Menú de Gestión (NUEVO)

### Botones disponibles:
- **🏆 Ranking Individual**: Abre clasificación general por temporadas
- **🏅 Ranking Equipos Temporada**: Abre ranking agregado de equipos
- **💾 Exportar Clasificación Equipos**: Descarga CSV del concurso actual
- **🖨️ Imprimir Clasificación Equipos**: Genera vista de impresión
- **🗑️ Borrar Histórico**: Elimina TODOS los datos (requiere confirmación doble)

---

## 👥 Modo Multiusuario Offline

### 🎯 Escenario: Varios pesadores en diferentes zonas SIN internet

**Nuevo: "Modo Zona"**
- Cada pesador activa su zona fija
- No necesita seleccionar zona en cada pesaje
- Trabaja más rápido y sin errores
- Al final se combinan los datos

**Cómo usarlo:**
1. Cada pesador abre la app en su móvil
2. Va a "🎯 Modo Zona (Multiusuario)"
3. Selecciona su zona (ej: Zona A)
4. Pulsa "✅ Activar modo zona"
5. La zona queda fija automáticamente
6. Registra pesajes rápidamente

**Al finalizar:**
- Exporta desde cada móvil a Excel
- Combina los archivos en un ordenador
- O copia manualmente al ranking general

📖 **Guía completa multiusuario**: Ver [GUIA_MOVIL.md](GUIA_MOVIL.md)

---

## 📊 Funcionalidades

### 📅 **Gestión de Concursos**
- Crear concursos por fecha y temporada
- Seleccionar concurso activo
- Gestión de zonas dinámicas
- Histórico completo

### ⚖️ **Registro de Pesajes**
- Puesto, nombre, zona, peso
- **✏️ Editar** registros existentes
- **🗑️ Eliminar** registros
- Validación de datos

### 🏅 **Clasificación del Concurso**
- Ordenación automática por peso
- Filtrado por zona
- **📤 Exportar a Excel**
- **🖨️ Imprimir** clasificación

### 🏆 **Ranking General**
- Se abre en ventana nueva
- Clasificación acumulada por temporada
- Medallas para los 3 primeros (🥇🥈🥉)
- Contador de concursos participados
- Exportar e imprimir

### 🎯 **Modo Zona (Nuevo)**
- Fija una zona para trabajar rápido
- Ideal para múltiples pesadores
- Zona auto-seleccionada en formulario
- Feedback visual activo

---

## 📁 Archivos del Proyecto

### Archivos principales:
- `index.html` - Página principal
- `app.js` - Lógica de la aplicación
- `styles.css` - Estilos responsive
- `ranking.html` - Página de ranking
- `ranking.js` - Lógica del ranking
- `logo.png` - Logo de la asociación

### PWA:
- `manifest.webmanifest` - Configuración PWA
- `service-worker.js` - Cache offline (v3-mobile)

### Documentación:
- `README.md` - Este archivo
- `GUIA_MOVIL.md` - Guía de instalación móvil
- `IMPLEMENTACION_ONLINE.md` - Guía para sincronización en tiempo real (futura)

---

## 🎨 Optimización Móvil

### ✅ Mejoras implementadas:
- Botones más grandes (min 44px para touch)
- Inputs con tamaño óptimo (evita zoom iOS)
- Scroll horizontal en tablas
- Diseño adaptativo (responsive)
- Feedback visual mejorado
- Vibración en acciones importantes
- Soporte para safe areas (notch)
- Orientación horizontal optimizada

### 📐 Breakpoints:
- **768px**: Tablet/móvil grande
- **400px**: Móvil pequeño
- Soporte orientación horizontal

---

## 💾 Almacenamiento

**LocalStorage**: `clasificacion_pesca_upp_v2`

Estructura:
```javascript
{
  concursos: [
    {
      id: "2026-03-15",
      fecha: "2026-03-15",
      temporada: 2026,
      zonas: ["Zona A", "Zona B"],
      registros: [
        { id, puesto, nombre, zona, peso }
      ]
    }
  ],
  concursoActivoId: "2026-03-15"
}
```

---

## 🔄 Sincronización en Tiempo Real (Futura)

Para sincronizar datos entre múltiples dispositivos EN TIEMPO REAL:

📖 **Guía completa**: Ver [IMPLEMENTACION_ONLINE.md](IMPLEMENTACION_ONLINE.md)

**Resumen:**
- Requiere servidor + base de datos
- WebSockets para tiempo real
- Coste: ~60€/año (hosting)
- Desarrollo: ~1 semana
- Necesita conexión a internet continua

**Recomendación**: La app actual offline es completamente funcional. Evalúa si realmente necesitas sincronización en tiempo real.

---

## 🚀 Cómo Usar

### Primera vez:
1. Abre index.html en el navegador
2. Crea un concurso (fecha + temporada)
3. Configura las zonas
4. Registra pesajes
5. Consulta clasificación y ranking

### En móvil:
1. Instala la app (ver guía arriba)
2. Abre desde el icono de inicio
3. Funciona sin internet
4. Exporta cuando tengas conexión

### Trabajo multiusuario:
1. Instala en varios móviles
2. Cada uno activa su "Modo Zona"
3. Registran pesajes independientemente
4. Al final, exportan y combinan datos

---

## 🛠️ Solución de Problemas

**❓ No funciona sin internet**
→ Abre la app CON internet la primera vez para cachear archivos

**❓ Los datos desaparecen**
→ No uses modo incógnito ni borres datos del navegador
→ Exporta regularmente a Excel

**❓ No se instala en móvil**
→ Usa Chrome (Android) o Safari (iOS)
→ Algunos navegadores no soportan PWA

**❓ La zona fija no funciona**
→ Verifica que pulsaste "✅ Activar modo zona"
→ Debe aparecer mensaje verde

---

## 📞 Soporte

Contacta con el desarrollador para dudas o problemas.

---

## 📄 Licencia

© 2026 - Unión de Pescadores de Plasencia
Desarrollado por Gabriel García Lorenzo

**Versión**: 3.0 - PWA Mobile + Modo Multiusuario
**Última actualización**: Enero 2026

## Contraseña Administrado:
app.js linea 4. Resto lineas para modificar pregunta de acceso
