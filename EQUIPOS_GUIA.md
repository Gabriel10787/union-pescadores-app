# 🤝 Guía de Competición por Equipos

## Descripción general

La aplicación ahora soporta **competición por equipos**, permitiendo que los pescadores compitan individualmente pero también sumen puntos para su equipo.

---

## Características principales

### 1. Gestión de equipos
- **Añadir equipos**: Cada concurso puede tener sus propios equipos
- **Eliminar equipos**: Click en el chip de equipo para eliminarlo
- **Equipos persistentes**: Los equipos se guardan en localStorage
- **Diseño visual distintivo**: Los equipos tienen un color naranja/cálido para diferenciarlos de las zonas (verde)

### 2. Asignación de pescadores a equipos
- Al registrar un pesaje, puedes seleccionar:
  - **Sin equipo**: El pescador compite solo individualmente
  - **Equipo específico**: El pescador suma puntos para ese equipo

### 3. Clasificación por equipos (Concurso actual)
- **Vista en tiempo real**: Tabla de equipos en la página principal
- **Datos mostrados**:
  - Posición del equipo
  - Nombre del equipo
  - Peso total acumulado (suma de todos los miembros)
  - Número de miembros del equipo
  - Promedio de peso por miembro
- **Ordenación**: Por peso total (de mayor a menor)

### 4. Ranking de equipos por temporada
- **Botón específico**: "🏅 Ranking Equipos Temporada"
- **Se abre en ventana nueva** para facilitar consultas paralelas
- **Agregación por temporada**: Suma todos los concursos de la misma temporada
- **Medallas visuales**: 🥇 🥈 🥉 para los 3 primeros equipos
- **Detalles expandibles**: Click en un equipo para ver:
  - Todos los concursos en los que participó
  - Peso acumulado por concurso
  - Total de miembros
  - Promedio general

### 5. Exportación e impresión
- **Exportar a CSV**: Descarga el ranking de equipos de la temporada
- **Imprimir**: Vista optimizada para impresión
- **Conserva el diseño visual**: Logos, medallas y colores

---

## Flujo de trabajo típico

### Paso 1: Crear concurso y equipos
1. Crear o seleccionar un concurso
2. En la sección "🤝 Equipos del concurso":
   - Escribir nombre del equipo (ej: "Los Barbos")
   - Click en "➜ Añadir equipo"
   - Repetir para todos los equipos

### Paso 2: Registrar pesajes con equipo
1. Completar formulario de registro:
   - Puesto, nombre, zona
   - **Equipo**: Seleccionar el equipo al que pertenece
   - Peso
2. Click en "Registrar"

### Paso 3: Ver clasificaciones
- **Individual**: Tabla "📊 Clasificación del concurso" (sin cambios)
- **Por equipos del concurso**: Tabla "🤝 Clasificación por equipos"
- **Por equipos de la temporada**: Click en "🏅 Ranking Equipos Temporada"

### Paso 4: Exportar e imprimir
- Desde la ventana de ranking de equipos:
  - "💾 Exportar CSV" para Excel/Sheets
  - "🖨️ Imprimir" para documento físico

---

## Datos técnicos

### Estructura de datos (localStorage)
```javascript
{
  concursos: [
    {
      id: "2026-03-15",
      fecha: "2026-03-15",
      temporada: 2026,
      zonas: ["Zona A", "Zona B", "Zona C"],
      equipos: ["Los Barbos", "Team Carpa", "Fishing Masters"], // NUEVO
      registros: [
        {
          id: 1234567890,
          puesto: 1,
          nombre: "Juan Pérez",
          zona: "Zona A",
          equipo: "Los Barbos", // NUEVO (puede ser "" si no tiene equipo)
          peso: 1500
        }
      ]
    }
  ],
  concursoActivoId: "2026-03-15"
}
```

### Archivos nuevos
- **ranking-equipos.html**: Página de ranking de equipos por temporada
- **ranking-equipos.js**: Lógica de agregación, exportación e impresión

### Modificaciones en archivos existentes
- **index.html**: 
  - Sección de gestión de equipos
  - Select "equipo" en el formulario
  - Tabla de clasificación por equipos
  - Botón "Ranking Equipos Temporada"
- **app.js**:
  - Funciones: `refrescarEquiposUI()`, `añadirEquipo()`, `eliminarEquipo()`
  - Función: `pintarTablaEquipos()` para la tabla del concurso
  - Actualización de `añadirRegistro()` y `editarRegistro()` con campo equipo
- **styles.css**:
  - Clases `.card-equipos`, `.badge-equipos` con colores cálidos
- **service-worker.js**:
  - Cache actualizado a `v4-equipos` incluyendo ranking-equipos.html/js

---

## Modo Zona + Equipos

El **Modo Zona** sigue funcionando igual:
- Cada usuario puede bloquearse a una zona específica
- Los pescadores de esa zona pueden asignarse a cualquier equipo
- Los equipos se comparten entre todas las zonas (son del concurso completo)

**Ejemplo**:
- Usuario 1 (Zona A) registra: Juan → Equipo "Los Barbos"
- Usuario 2 (Zona B) registra: María → Equipo "Los Barbos"
- Ambos suman para el mismo equipo "Los Barbos"

---

## Preguntas frecuentes

### ¿Puedo tener equipos diferentes en cada concurso?
**Sí**, cada concurso tiene su propia lista de equipos independiente.

### ¿Qué pasa si elimino un equipo?
Los registros que tenían ese equipo **conservan el nombre** del equipo, pero ya no podrás asignar nuevos pescadores a ese equipo eliminado.

### ¿Puedo cambiar el equipo de un pescador?
**Sí**, usa el botón "✏️ Editar" en la tabla de clasificación individual, cambia el equipo y guarda.

### ¿Cómo se calcula el ranking de temporada?
Se suman **todos** los pesos de todos los concursos con la misma temporada, agrupados por equipo.

### ¿Funciona offline?
**Sí**, completamente offline como el resto de la aplicación, incluyendo la página de ranking de equipos.

---

## Notas de estilo visual

- **Color de equipos**: Naranja/cálido (`--accent-warm: #ffb347`)
- **Color de zonas**: Verde (`--accent: #44c4a1`)
- **Badges de equipos**: Fondo naranja translúcido con borde naranja
- **Cards de equipos**: Borde izquierdo naranja

Esto facilita distinguir visualmente las secciones de equipos de las de zonas.

---

## Soporte

Para más información sobre la aplicación general, consulta:
- **README.md**: Documentación completa de la app
- **GUIA_MOVIL.md**: Instalación en dispositivos móviles
- **IMPLEMENTACION_ONLINE.md**: Arquitectura para sincronización online (futuro)
