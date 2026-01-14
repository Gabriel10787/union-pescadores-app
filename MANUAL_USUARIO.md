# 📖 Manual de Usuario - Unión de Pescadores de Plasencia

## 🎣 Sistema de Gestión de Concursos de Pesca

**Versión:** 2.0  
**Fecha:** Enero 2026  
**Desarrollado para:** Unión de Pescadores de Plasencia

---

## 📑 Índice

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Gestión de Concursos](#gestión-de-concursos)
4. [Registro de Pesajes](#registro-de-pesajes)
5. [Gestión de Equipos](#gestión-de-equipos)
6. [Zonas de Concurso](#zonas-de-concurso)
7. [Consultas y Rankings](#consultas-y-rankings)
8. [Exportación e Impresión](#exportación-e-impresión)
9. [Panel de Administrador](#panel-de-administrador)
10. [Personalización](#personalización)
11. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Introducción

### ¿Qué es esta aplicación?

La aplicación de gestión de concursos de pesca es una herramienta completa diseñada para:
- ✅ Organizar y gestionar concursos de pesca
- ✅ Registrar pesajes y clasificaciones
- ✅ Gestionar equipos y temporadas
- ✅ Generar rankings automáticos
- ✅ Exportar e imprimir resultados
- ✅ Mantener histórico de todos los concursos

### Características principales

- 🌐 **Progressive Web App (PWA)**: Funciona sin conexión a internet
- 💾 **Almacenamiento local**: Todos los datos se guardan en tu navegador
- 📱 **Responsive**: Se adapta a móviles, tablets y ordenadores
- 🌓 **Modo claro/oscuro**: Personaliza la visualización
- 🔐 **Panel de administrador**: Control total sobre los datos
- 📊 **Rankings automáticos**: Individual y por equipos

---

## 🔑 Acceso al Sistema

### Abrir la aplicación

1. Abre tu navegador web (Chrome, Firefox, Edge, Safari)
2. Navega a la URL donde está alojada la aplicación
3. La aplicación se carga automáticamente
4. Recomiendo que la guardes en tus favoritos

### Primera vez usando la app

La primera vez que accedas:
- No hay concursos creados
- Necesitarás crear un concurso desde el panel de administrador
- La contraseña de administrador por defecto es: **Pesc@dores**

⚠️ **IMPORTANTE:** Cambia la contraseña por defecto en el código fuente por seguridad.

---

## 🏆 Gestión de Concursos

### Ver concurso activo

En la pantalla principal verás:
- **Selector de concurso**: Desplegable en la parte superior
- **Información del concurso**: Nombre, fecha, temporada, lugar, hora y zonas

### Crear un nuevo concurso

1. Haz clic en el menú **☰ Menú** (esquina superior derecha)
2. Selecciona **🔐 Administrador**
3. Introduce la contraseña de administrador
4. En el panel, ve a **"Crear nuevo concurso"**
5. Rellena los campos:
   - **Fecha** (obligatorio): Formato DD/MM/AAAA (ejemplo: 14/01/2026)
   - **Temporada** (obligatorio): Año de la temporada (ejemplo: 2026)
   - **Nombre**: Nombre descriptivo (opcional)
   - **Lugar**: Ubicación del concurso (opcional)
   - **Hora**: Hora de inicio (opcional)
6. Haz clic en **✅ Añadir concurso**

### Cambiar de concurso

1. En la pantalla principal, usa el **selector de concurso**
2. Selecciona el concurso que deseas consultar
3. La información y tabla se actualizarán automáticamente

---

## 🎣 Registro de Pesajes

### Añadir un nuevo pesaje

1. Asegúrate de tener un **concurso activo** seleccionado
2. En el formulario **"Añadir Pesaje"**, completa:
   - **Puesto** (obligatorio): Número de puesto del pescador
   - **Nombre** (obligatorio): Nombre del pescador
   - **Primer Apellido** (obligatorio)
   - **Segundo Apellido** (opcional)
   - **Zona**: Zona de pesca (si el concurso tiene zonas)
   - **Equipo**: Selecciona un equipo (opcional)
   - **Peso** (obligatorio): Peso en gramos
3. Haz clic en **✅ Añadir Registro**

📝 **Nota:** Los nombres se guardan automáticamente en MAYÚSCULAS.

### Editar un pesaje

1. En la tabla de clasificación, busca el registro
2. Haz clic en el botón **✏️ Editar**
3. Modifica los datos en el formulario
4. Haz clic en **✅ Añadir Registro** (ahora dirá "Actualizar")
5. Para cancelar la edición, haz clic en **❌ Cancelar Edición**

### Eliminar un pesaje

1. En la tabla de clasificación, busca el registro
2. Haz clic en el botón **🗑️ Eliminar**
3. Confirma la eliminación

### Filtrar por zona

Si el concurso tiene zonas configuradas:
1. Usa el **selector "Filtrar por zona"** encima de la tabla
2. Selecciona "Todas las zonas" o una zona específica
3. La tabla se actualizará automáticamente

---

## 👥 Gestión de Equipos

### Ver equipos existentes

1. Haz clic en el menú **☰ Menú**
2. Selecciona **🤝 Equipos**
3. Se abrirá una ventana con:
   - Lista de equipos existentes
   - Formulario para añadir nuevos equipos

### Crear un nuevo equipo

1. Abre el modal de equipos (ver arriba)
2. Introduce el nombre del equipo
3. Haz clic en **➕ Añadir Equipo**

### Editar un equipo

1. En la lista de equipos, haz clic en **✏️** junto al equipo
2. Introduce el nuevo nombre
3. El cambio se guarda automáticamente

### Eliminar un equipo

1. En la lista de equipos, haz clic en **🗑️** junto al equipo
2. Confirma la eliminación

⚠️ **Advertencia:** Si hay pescadores asignados a este equipo, quedarán sin equipo.

### Ranking de Equipos por Temporada

1. Haz clic en el menú **☰ Menú**
2. Selecciona **🏅 Ranking Equipos Temporada**
3. Se abrirá una nueva ventana con:
   - Clasificación de equipos
   - Peso total acumulado
   - Promedio por miembro
   - Número de miembros

---

## 🗺️ Zonas de Concurso

### Activar zonas para un concurso

1. Crea o selecciona un concurso
2. En el panel de administrador, haz clic en **🗺️ Gestionar zonas del concurso**
3. El botón solo está disponible si hay un concurso activo

### Añadir una zona

1. En el panel de zonas, introduce el nombre de la zona
2. Haz clic en **➕ Añadir Zona**
3. La zona aparecerá en la lista

### Eliminar una zona

1. En la lista de zonas, haz clic sobre la zona que deseas eliminar
2. Confirma la eliminación

### Modo Zona Multiusuario

Este modo permite fijar una zona para que todos los registros se asignen automáticamente:

1. Selecciona una zona de la lista
2. Haz clic en **🔒 Fijar Zona**
3. Se activará el modo y todos los pesajes irán a esa zona
4. Para desactivar, haz clic en **🔓 Desactivar Modo Zona**

---

## 📊 Consultas y Rankings

### Tabla de Clasificación Individual

La tabla principal muestra:
- **Posición Final**: Con medallas para los 3 primeros (🥇🥈🥉)
- **Puesto**: Número de puesto del pescador
- **Nombre y Apellidos**: En mayúsculas
- **Zona**: Zona de pesca
- **Equipo**: Equipo al que pertenece
- **Peso**: Peso capturado en gramos
- **Acciones**: Editar o eliminar

### Ranking Individual Completo

1. Haz clic en el menú **☰ Menú**
2. Selecciona **🏆 Ranking Individual**
3. Se abrirá una nueva ventana con el ranking completo de la temporada

### Clasificación por Equipos

1. En la pantalla principal, ve a la tabla **"Clasificación por Equipos"**
2. Verás:
   - Posición
   - Nombre del equipo
   - Peso total acumulado
   - Número de miembros
   - Promedio por miembro

---

## 💾 Exportación e Impresión

### Exportar a Excel

**Clasificación Individual:**
1. Haz clic en **💾 Exportar a Excel** (bajo la tabla)
2. O desde el menú: **💾 Exportar Clasificación Individual**
3. Se descargará un archivo .xls con la tabla

**Clasificación por Equipos:**
1. Desde el menú: **💾 Exportar Clasificación Equipos**
2. Se descargará un CSV con los datos de equipos

### Imprimir resultados

**Clasificación Individual:**
1. Haz clic en **🖨️ Imprimir** (bajo la tabla)
2. O desde el menú: **🖨️ Imprimir Clasificación Individual**
3. Se abrirá una ventana de vista previa
4. Usa el botón de imprimir de tu navegador

**Clasificación por Equipos:**
1. Desde el menú: **🖨️ Imprimir Clasificación Equipos**
2. Se abrirá una ventana de vista previa

📄 **Nota:** Las impresiones incluyen el logo, fecha, temporada, lugar y hora del concurso.

---

## 🔐 Panel de Administrador

### Acceder al panel

1. Haz clic en el menú **☰ Menú**
2. Selecciona **🔐 Administrador**
3. Introduce la contraseña: **Pesc@dores** (por defecto)
4. Haz clic en **Acceder**

### Funciones del administrador

Desde el panel de administrador puedes:

#### Gestión de Concursos
- ➕ Crear nuevos concursos
- 📝 Ver histórico de concursos
- ✏️ Editar concursos existentes
- 🗑️ Eliminar concursos

#### Gestión de Zonas
- 🗺️ Añadir/eliminar zonas de concurso
- 🔒 Activar modo zona multiusuario
- Ver lista de zonas activas

#### Histórico
- 🗑️ **Borrar Histórico**: Elimina TODOS los datos
  - Requiere triple confirmación
  - Solicita contraseña de seguridad
  - Acción IRREVERSIBLE

### Recuperar contraseña olvidada

1. En la pantalla de acceso de administrador
2. Haz clic en **🔑 ¿Olvidaste tu contraseña?**
3. Responde la pregunta de seguridad
4. **Pregunta:** "¿Cuál es el nombre del río principal de la zona?"
5. **Respuesta:** jertiga (en minúsculas)
6. La contraseña se mostrará y se auto-completará

### Cerrar sesión de administrador

1. En el panel de administrador
2. Haz clic en **Cerrar sesión**
3. Volverás a la vista normal

---

## 🎨 Personalización

### Cambiar tema claro/oscuro

1. En la esquina superior izquierda, busca el botón 🌙 o ☀️
2. Haz clic para cambiar entre:
   - 🌙 **Modo oscuro**: Fondo oscuro, ideal para la noche
   - ☀️ **Modo claro**: Fondo claro, ideal para el día
3. Tu preferencia se guarda automáticamente

### Características de accesibilidad

- ✅ Alto contraste en ambos modos
- ✅ Navegación por teclado mejorada
- ✅ Focus visible en todos los elementos
- ✅ Soporte para preferencias del sistema

---

## ❓ Solución de Problemas

### Los datos no se guardan

**Problema:** Los registros desaparecen al recargar.

**Solución:**
1. Verifica que tu navegador permite localStorage
2. No uses modo incógnito/privado
3. Verifica el espacio disponible en el navegador
4. Borra la caché y vuelve a cargar

### No puedo crear un concurso

**Problema:** El botón "Añadir concurso" no funciona.

**Solución:**
1. Verifica que introduces la **fecha** (obligatorio)
2. Verifica que introduces la **temporada** (obligatorio)
3. La fecha debe tener formato DD/MM/AAAA (ejemplo: 14/01/2026)
4. La temporada debe ser un año válido (ejemplo: 2026)

### Olvidé la contraseña de administrador

**Solución:**
1. Haz clic en **🔑 ¿Olvidaste tu contraseña?**
2. Responde la pregunta de seguridad: "tajo"
3. Si no funciona, contacta con el desarrollador

### La tabla no muestra datos

**Problema:** La tabla está vacía.

**Solución:**
1. Verifica que hay un **concurso activo** seleccionado
2. Verifica que has añadido pesajes a ese concurso
3. Si usas filtro de zona, verifica que hay registros en esa zona
4. Prueba a seleccionar "Todas las zonas"

### Error al exportar/imprimir

**Problema:** No se genera el archivo o la impresión.

**Solución:**
1. Verifica que tu navegador permite descargas
2. Verifica que hay datos en el concurso
3. Prueba con otro navegador
4. Desactiva extensiones de bloqueo de pop-ups

### La aplicación va lenta

**Solución:**
1. Borra datos antiguos que no necesites
2. Cierra otras pestañas del navegador
3. Reinicia el navegador
4. Actualiza a la última versión

---

## 💡 Consejos y Buenas Prácticas

### Para organizadores de concursos

1. ✅ Crea el concurso **antes** del día del evento
2. ✅ Configura las zonas con antelación
3. ✅ Crea los equipos antes de empezar
4. ✅ Usa el modo zona multiusuario si todos van a la misma zona
5. ✅ Haz copias de seguridad exportando a Excel regularmente

### Para secretarios/registradores

1. ✅ Verifica que el concurso activo es el correcto
2. ✅ Escribe los nombres en mayúsculas (la app lo hace automáticamente)
3. ✅ Verifica el peso antes de confirmar
4. ✅ Usa el botón editar si te equivocas
5. ✅ Filtra por zona para facilitar la búsqueda

### Para administradores

1. ✅ Cambia la contraseña por defecto
2. ✅ No compartas la contraseña de administrador
3. ✅ Haz copias de seguridad periódicas
4. ✅ Verifica los datos antes de publicar resultados
5. ✅ Cierra sesión de administrador cuando termines

---

## 📞 Soporte Técnico

### Información del sistema

- **Aplicación:** Gestión de Concursos UPP
- **Versión:** 2.0
- **Almacenamiento:** localStorage del navegador
- **Compatible con:** Chrome, Firefox, Edge, Safari

### Datos de desarrollo

- **Organización:** Unión de Pescadores de Plasencia
- **Desarrollado:** Enero 2026
- **Tipo:** Progressive Web App (PWA)

### Contacto

Para soporte técnico o dudas:
- Contacta con el administrador de tu organización
- Consulta el archivo README.md para información técnica

---

## 📝 Notas Finales

### Seguridad de los datos

- Los datos se almacenan **localmente** en tu navegador
- No se envían datos a ningún servidor externo
- Haz copias de seguridad exportando a Excel
- El borrado del histórico es **irreversible**

### Actualizaciones

Esta aplicación puede recibir actualizaciones:
- Las actualizaciones se instalan automáticamente
- Puede aparecer un aviso pidiendo recargar
- Tus datos se mantendrán tras actualizar

### Privacidad

- No se recopilan datos personales
- No hay tracking ni analytics
- Todo funciona offline
- Los datos solo existen en tu dispositivo

---

**¡Gracias por usar el Sistema de Gestión de Concursos de Pesca!** 🎣

*Unión de Pescadores de Plasencia - 2026*
