# 🔐 Guía de Administrador - Unión de Pescadores de Plasencia

## 🎯 Sistema de Administrador

La aplicación ahora incluye un **Modo Administrador** con funcionalidades avanzadas de gestión que requieren autenticación mediante contraseña.

---

## 🔑 Acceso al Modo Administrador

### Contraseña por defecto:
```
pescadores2026
```

⚠️ **IMPORTANTE**: Esta contraseña está almacenada en el código de [app.js](app.js#L4). Para cambiar la contraseña, modifica la constante `ADMIN_PASSWORD`.

### Cómo acceder:
1. Pulsa el botón **☰ Menú** en la cabecera
2. Selecciona **🔐 Modo Administrador** (última opción)
3. Introduce la contraseña
4. Click en **Acceder**

### Sesión persistente:
- Una vez autenticado, la sesión se mantiene hasta que cierres manualmente
- La sesión se guarda en localStorage
- Para cerrar sesión: Click en **Cerrar sesión** dentro del panel de administrador

---

## 🛠️ Funcionalidades de Administrador

### 1. **Editar Concursos** ✏️

**Qué puedes editar:**
- ✅ Fecha del concurso
- ✅ Nombre personalizado del concurso

**Cómo editar:**
1. Accede al Modo Administrador
2. Busca el concurso en la lista
3. Click en **✏️ Editar**
4. Introduce la nueva fecha (formato: YYYY-MM-DD)
5. Introduce el nuevo nombre (o deja el actual)
6. Confirma los cambios

**Validaciones:**
- La fecha debe tener formato válido YYYY-MM-DD
- No puede existir otro concurso con la misma fecha nueva
- Los registros del concurso se mantienen intactos

**Ejemplo de uso:**
```
Fecha original: 2026-01-15
Nombre original: Concurso 2026-01-15

Nueva fecha: 2026-01-22
Nuevo nombre: Concurso de Invierno
```

---

### 2. **Eliminar Concursos** 🗑️

**Qué se elimina:**
- ❌ Todo el concurso completo
- ❌ Todos los registros de pesajes
- ❌ No se eliminan los equipos de la temporada (están a nivel global)

**Cómo eliminar:**
1. Accede al Modo Administrador
2. Busca el concurso en la lista
3. Click en **🗑️ Eliminar**
4. Lee el resumen del concurso
5. Confirma la acción
6. **IMPORTANTE**: Escribe el nombre exacto del concurso para confirmar

**Protecciones de seguridad:**
- ⚠️ Doble confirmación requerida
- ⚠️ Debes escribir el nombre exacto del concurso
- ⚠️ Acción irreversible

**Ejemplo de confirmación:**
```
⚠️ ¿Eliminar el concurso "Concurso de Invierno"?

Fecha: 2026-01-22
Registros: 45

Esta acción NO se puede deshacer.

Para confirmar, escribe el nombre del concurso:
"Concurso de Invierno"
```

---

## 📝 Nombre Personalizado de Concursos

### Nueva característica (disponible para todos los usuarios):

Al crear un concurso, ahora puedes asignarle un **nombre personalizado**:

**Ubicación:**
- Sección "📅 Concurso"
- Campo: **"Nombre del concurso (opcional)"**

**Ejemplos de nombres:**
- Concurso de Primavera
- Torneo Anual UPP
- Campeonato Regional
- Concurso Benéfico

**Comportamiento:**
- Si NO se proporciona nombre → Se genera automáticamente: "Concurso YYYY-MM-DD"
- Si se proporciona nombre → Se usa el nombre personalizado
- El nombre aparece en:
  - Selector de concursos
  - Rankings
  - Exportaciones
  - Panel de administrador

---

## 🔒 Seguridad del Sistema

### Protección por contraseña:
- La contraseña se almacena en el código (app.js)
- No hay transmisión de red (app 100% offline)
- Sesión guardada en localStorage del navegador

### Cambiar la contraseña:
1. Abre [app.js](app.js)
2. Busca la línea 4: `const ADMIN_PASSWORD = "pescadores2026";`
3. Cambia el valor entre comillas
4. Guarda el archivo
5. Recarga la aplicación

**Ejemplo:**
```javascript
const ADMIN_PASSWORD = "miPasswordSeguro123!";
```

### Cerrar sesión de administrador:
```
1. Accede al Modo Administrador
2. Click en "Cerrar sesión"
3. La sesión se elimina del navegador
```

---

## 🎨 Interfaz del Panel de Administrador

### Lista de concursos:
Cada concurso muestra:
- **Nombre del concurso** (en negrita con color destacado)
- **Fecha** 📅
- **Temporada** 
- **Número de registros**

### Botones de acción:
- **✏️ Editar** - Color verde
- **🗑️ Eliminar** - Color rojo

### Estados visuales:
- ✅ Sesión activa - Barra verde
- ❌ Contraseña incorrecta - Mensaje rojo
- ⚠️ Confirmaciones - Diálogos del sistema

---

## 🔄 Flujo de trabajo típico

### Escenario 1: Cambiar fecha de un concurso
```
1. Menú → Modo Administrador
2. Introducir contraseña
3. Buscar el concurso en la lista
4. Click en "✏️ Editar"
5. Cambiar fecha: 2026-01-15 → 2026-01-22
6. Cambiar nombre (opcional)
7. Confirmar
```

### Escenario 2: Eliminar concurso antiguo
```
1. Menú → Modo Administrador
2. Introducir contraseña (si no hay sesión activa)
3. Buscar el concurso antiguo
4. Click en "🗑️ Eliminar"
5. Leer el resumen
6. Confirmar acción
7. Escribir nombre exacto del concurso
8. Concurso eliminado
```

### Escenario 3: Renombrar concurso
```
1. Menú → Modo Administrador
2. Acceder al panel
3. Click en "✏️ Editar" del concurso
4. Mantener la misma fecha
5. Cambiar solo el nombre
6. Confirmar
```

---

## ⚠️ Advertencias Importantes

### ❌ NO HACER:
- No compartas la contraseña con usuarios no autorizados
- No elimines concursos sin hacer una exportación previa de seguridad
- No cambies fechas de concursos que ya tienen rankings publicados

### ✅ BUENAS PRÁCTICAS:
- Exporta los datos antes de hacer cambios importantes
- Usa nombres descriptivos para los concursos
- Verifica dos veces antes de eliminar un concurso
- Cambia la contraseña por defecto en producción
- Cierra la sesión de administrador cuando termines

---

## 🚨 Recuperación de Errores

### Si eliminas un concurso por error:
❌ **No hay forma de recuperarlo** - La eliminación es permanente
✅ Solución: Tener backups externos (exportaciones CSV periódicas)

### Si cambias una fecha incorrecta:
✅ Puedes volver a editarla y corregir la fecha

### Si olvidas la contraseña:
✅ Puedes verla en el código fuente: [app.js](app.js) línea 4

---

## 📊 Comparación: Usuario Normal vs Administrador

| Funcionalidad | Usuario Normal | Administrador |
|---------------|----------------|---------------|
| Crear concursos | ✅ | ✅ |
| Añadir pesajes | ✅ | ✅ |
| Editar pesajes | ✅ | ✅ |
| Eliminar pesajes | ✅ | ✅ |
| Ver rankings | ✅ | ✅ |
| Exportar datos | ✅ | ✅ |
| **Editar fecha de concurso** | ❌ | ✅ |
| **Editar nombre de concurso** | ❌ | ✅ |
| **Eliminar concurso completo** | ❌ | ✅ |
| Borrar histórico completo | ✅ | ✅ |

---

## 💡 Casos de uso reales

### Caso 1: Error en la fecha del concurso
**Problema**: Creaste el concurso con fecha 2026-01-15 pero era el 2026-01-22

**Solución**:
1. Modo Administrador
2. Editar concurso
3. Cambiar fecha a 2026-01-22
4. Los registros se mantienen intactos

### Caso 2: Concurso de prueba
**Problema**: Hiciste un concurso de prueba con datos ficticios

**Solución**:
1. Modo Administrador
2. Eliminar concurso de prueba
3. Confirmar con el nombre exacto

### Caso 3: Mejorar nombres de concursos
**Problema**: Los nombres automáticos "Concurso 2026-01-15" no son descriptivos

**Solución**:
1. Modo Administrador
2. Editar cada concurso
3. Cambiar nombre a "Torneo de Invierno", "Campeonato de Verano", etc.

---

## 🔧 Configuración Técnica

### Archivo: app.js
```javascript
// Línea 4 - Contraseña de administrador
const ADMIN_PASSWORD = "pescadores2026";
```

### localStorage utilizado:
- `upp_admin_session` → Estado de sesión ("activa" o no existe)
- `clasificacion_pesca_upp_v2` → Datos de concursos

### Service Worker:
- Versión: `v7-admin-system`
- Caché incluye todas las funcionalidades de administrador

---

## 📞 Soporte

Para cambiar la contraseña o cualquier configuración técnica, edita el archivo [app.js](app.js).

**Ubicación de la contraseña**: Línea 4
**Función de verificación**: `verificarSesionAdmin()`
**Funciones principales**:
- `editarConcursoAdmin(concursoId)`
- `eliminarConcursoAdmin(concursoId)`
- `refrescarListaConcursosAdmin()`

---

**Versión del sistema**: v7-admin-system  
**Última actualización**: Enero 2026
