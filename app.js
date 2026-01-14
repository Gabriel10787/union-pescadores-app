// Clave para localStorage (nueva versión de la estructura)
const STORAGE_KEY = "clasificacion_pesca_upp_v2";
const ADMIN_KEY = "upp_admin_session";
const PASSWORD_KEY = "upp_admin_password_v2";
const DEFAULT_ADMIN_PASSWORD = "Pesc@dores"; // Contraseña por defecto (cambiar en producción)
const SECURITY_QUESTION = "¿Cuál es el nombre del río principal de la zona?";
const SECURITY_ANSWER = "tajo"; // Respuesta (en minúsculas, cambiar en producción)

// Función para obtener la contraseña actual (desde localStorage o por defecto)
function obtenerPasswordActual() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

// Función para validar que la contraseña sea segura
function validarPasswordSegura(password) {
  // Mínimo 8 caracteres
  if (password.length < 8) {
    return { valida: false, mensaje: "La contraseña debe tener al menos 8 caracteres" };
  }
  
  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    return { valida: false, mensaje: "La contraseña debe contener al menos una letra mayúscula" };
  }
  
  // Al menos una minúscula
  if (!/[a-z]/.test(password)) {
    return { valida: false, mensaje: "La contraseña debe contener al menos una letra minúscula" };
  }
  
  // Al menos un signo/carácter especial
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valida: false, mensaje: "La contraseña debe contener al menos un carácter especial (ej: @#$%&*)" };
  }
  
  return { valida: true, mensaje: "Contraseña válida" };
}

// Función para cambiar la contraseña
function cambiarPassword() {
  const passwordActual = obtenerPasswordActual();
  
  // Solicitar contraseña actual
  const passwordIngresada = prompt("🔒 Introduce tu contraseña actual:");
  
  if (!passwordIngresada) {
    return; // Usuario canceló
  }
  
  if (passwordIngresada !== passwordActual) {
    alert("❌ Contraseña actual incorrecta");
    return;
  }
  
  // Solicitar nueva contraseña
  const nuevaPassword = prompt("🔑 Introduce la nueva contraseña:\n\n✅ Requisitos:\n• Mínimo 8 caracteres\n• Al menos 1 letra mayúscula\n• Al menos 1 letra minúscula\n• Al menos 1 carácter especial (@#$%&*)");
  
  if (!nuevaPassword) {
    return; // Usuario canceló
  }
  
  // Validar que la nueva contraseña sea segura
  const validacion = validarPasswordSegura(nuevaPassword);
  
  if (!validacion.valida) {
    alert("❌ " + validacion.mensaje);
    return;
  }
  
  // Confirmar nueva contraseña
  const confirmarPassword = prompt("🔑 Confirma la nueva contraseña:");
  
  if (confirmarPassword !== nuevaPassword) {
    alert("❌ Las contraseñas no coinciden");
    return;
  }
  
  // Guardar nueva contraseña
  localStorage.setItem(PASSWORD_KEY, nuevaPassword);
  alert("✅ Contraseña cambiada correctamente\n\n⚠️ Guárdala en un lugar seguro");
}

// =====================================================
// Función de utilidad para formatear fechas
// =====================================================
function formatearFechaEspanol(fecha) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  let fechaObj;
  
  // Si es un string en formato DD/MM/YYYY
  if (typeof fecha === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
    const [dia, mes, anio] = fecha.split('/').map(num => parseInt(num, 10));
    fechaObj = new Date(anio, mes - 1, dia);
  }
  // Si es un string en formato ISO (YYYY-MM-DD)
  else if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    fechaObj = new Date(fecha + 'T00:00:00');
  }
  // Si ya es un objeto Date
  else if (fecha instanceof Date) {
    fechaObj = fecha;
  }
  // Si no se puede convertir, devolver el string original
  else {
    return fecha;
  }
  
  // Verificar que la fecha sea válida
  if (isNaN(fechaObj.getTime())) {
    return fecha;
  }
  
  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const anio = fechaObj.getFullYear();
  
  return `${dia} de ${mes} de ${anio}`;
}

// =====================================================
// Registro del Service Worker para PWA
// =====================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado correctamente:', registration.scope);
        
        // Verificar si hay actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Nueva versión del Service Worker encontrada');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📱 Nueva versión disponible. Recarga para actualizar.');
              // Opcional: mostrar notificación al usuario
              if (confirm('Nueva versión disponible. ¿Recargar la app?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  });

  // Recargar cuando el nuevo service worker toma control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Estructura general esperada en storage:
// {
//   concursos: [
//     {
//       id: "2026-03-15",
//       fecha: "2026-03-15",
//       temporada: 2026,
//       nombre: "Concurso 2026-03-15",
//       zonas: ["Zona A", "Zona B", "Zona C"],
//       registros: [
//         { id, puesto, nombre, zona, peso }
//       ]
//     }
//   ],
//   concursoActivoId: "2026-03-15"
// }

let concursos = [];
let concursoActivoId = null;
let zonaFijaActiva = null; // Para modo multiusuario

// Referencias a elementos del DOM
const formPesaje = document.getElementById("form-pesaje");
const tablaBody = document.querySelector("#tabla-clasificacion tbody");
const filtroZona = document.getElementById("filtro-zona");
const topConcursanteSpan = document.getElementById("top-concursante");
const btnExportar = document.getElementById("btn-exportar");
const btnGuardarPesaje = document.getElementById("btn-guardar-pesaje");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
const registroIdEdicion = document.getElementById("registro-id-edicion");

// Zonas dinámicas
const inputNuevaZona = document.getElementById("nueva-zona");
const btnAddZona = document.getElementById("btn-add-zona");
const listaZonasUl = document.getElementById("lista-zonas");

// Equipos
const inputNuevoEquipo = document.getElementById("nuevo-equipo");
const btnAddEquipo = document.getElementById("btn-add-equipo");
const listaEquiposUl = document.getElementById("lista-equipos");
const tablaEquiposBody = document.querySelector("#tabla-clasificacion-equipos tbody");
const mensajeSinEquipos = document.getElementById("mensaje-sin-equipos");

// Menú desplegable
const btnMenu = document.getElementById("btn-menu");
const menuDesplegable = document.getElementById("menu-desplegable");
const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuRankingIndividual = document.getElementById("menu-ranking-individual");
const menuExportarIndividual = document.getElementById("menu-exportar-individual");
const menuImprimirIndividual = document.getElementById("menu-imprimir-individual");
const menuRankingEquipos = document.getElementById("menu-ranking-equipos");
const menuExportarEquipos = document.getElementById("menu-exportar-equipos");
const menuImprimirEquipos = document.getElementById("menu-imprimir-equipos");
const menuBorrarHistorico = document.getElementById("menu-borrar-historico");
const menuGestionarEquipos = document.getElementById("menu-gestionar-equipos");
const menuAdmin = document.getElementById("menu-admin");

// Modal de administrador
const modalAdmin = document.getElementById("modal-admin");
const modalAdminOverlay = document.getElementById("modal-admin-overlay");
const btnCerrarModalAdmin = document.getElementById("btn-cerrar-modal-admin");
const inputPasswordAdmin = document.getElementById("input-password-admin");
const btnLoginAdmin = document.getElementById("btn-login-admin");
const btnRecuperarPassword = document.getElementById("btn-recuperar-password");
const btnLogoutAdmin = document.getElementById("btn-logout-admin");
const btnCambiarPassword = document.getElementById("btn-cambiar-password");
const adminPanel = document.getElementById("admin-panel");
const adminStatusText = document.getElementById("admin-status-text");
const listaConcursosAdmin = document.getElementById("lista-concursos-admin");
const listaEquiposAdmin = document.getElementById("lista-equipos-admin");

// Modal de equipos
const modalEquipos = document.getElementById("modal-equipos");
const modalEquiposOverlay = document.getElementById("modal-equipos-overlay");
const btnCerrarModalEquipos = document.getElementById("btn-cerrar-modal-equipos");

// Botón de cambio de tema
const btnThemeToggle = document.getElementById("btn-theme-toggle");
const THEME_KEY = "upp_theme_preference";

// Concursos / temporadas
const inputFechaConcurso = document.getElementById("fecha-concurso");
const inputTemporada = document.getElementById("temporada");
const inputNombreConcurso = document.getElementById("nombre-concurso");
const inputLugarConcurso = document.getElementById("lugar-concurso");
const inputHoraConcurso = document.getElementById("hora-concurso");
const btnNuevoConcurso = document.getElementById("btn-nuevo-concurso");
const selectConcurso = document.getElementById("select-concurso");
const btnToggleZonas = document.getElementById("btn-toggle-zonas");
const btnToggleZonasCerrar = document.getElementById("btn-toggle-zonas-cerrar");
const zonasConcursoSection = document.getElementById("zonas-concurso-section");
const campoZonaContainer = document.getElementById("campo-zona-container");

// Info concurso activo
const infoConcursoActivo = document.getElementById("info-concurso-activo");
const infoNombre = document.getElementById("info-nombre");
const infoFecha = document.getElementById("info-fecha");
const infoTemporada = document.getElementById("info-temporada");
const infoLugar = document.getElementById("info-lugar");
const infoHora = document.getElementById("info-hora");
const infoZonas = document.getElementById("info-zonas");

// Modo Zona (multiusuario)
const zonaFijaSelect = document.getElementById("zona-fija-select");
const btnActivarZonaFija = document.getElementById("btn-activar-zona-fija");
const btnDesactivarZonaFija = document.getElementById("btn-desactivar-zona-fija");
const zonaFijaInfo = document.getElementById("zona-fija-info");
const zonaFijaNombre = document.getElementById("zona-fija-nombre");

// ---------------------- Storage ----------------------

function cargarDesdeStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      concursos = parsed.concursos || [];
      concursoActivoId = parsed.concursoActivoId || (concursos[0]?.id ?? null);
      temporadas = parsed.temporadas || {};
      
      // Migrar equipos de concursos a temporadas (compatibilidad)
      concursos.forEach(c => {
        if (c.equipos && c.equipos.length > 0 && c.temporada) {
          if (!temporadas[c.temporada]) {
            temporadas[c.temporada] = { equipos: [] };
          }
          c.equipos.forEach(eq => {
            if (!temporadas[c.temporada].equipos.includes(eq)) {
              temporadas[c.temporada].equipos.push(eq);
            }
          });
        }
        delete c.equipos; // Eliminar equipos de concursos individuales
      });
    } catch (e) {
      console.error("Error al parsear storage", e);
      concursos = [];
      concursoActivoId = null;
      temporadas = {};
    }
  } else {
    concursos = [];
    concursoActivoId = null;
    temporadas = {};
  }
}

function guardarEnStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      concursos,
      concursoActivoId,
      temporadas,
    })
  );
}

// ---------------------- Sistema de Administrador ----------------------

function verificarSesionAdmin() {
  const sesion = localStorage.getItem(ADMIN_KEY);
  return sesion === "activa";
}

function activarSesionAdmin() {
  localStorage.setItem(ADMIN_KEY, "activa");
}

function cerrarSesionAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

function mostrarModalAdmin() {
  modalAdmin.style.display = "block";
  document.body.style.overflow = "hidden";
  
  if (verificarSesionAdmin()) {
    inputPasswordAdmin.style.display = "none";
    btnLoginAdmin.style.display = "none";
    adminStatusText.style.display = "none";
    adminPanel.style.display = "block";
    refrescarListaConcursosAdmin();
    refrescarListaEquiposAdmin();
  } else {
    inputPasswordAdmin.style.display = "block";
    btnLoginAdmin.style.display = "block";
    adminStatusText.style.display = "block";
    adminPanel.style.display = "none";
    inputPasswordAdmin.value = "";
    inputPasswordAdmin.focus();
  }
}

function cerrarModalAdmin() {
  modalAdmin.style.display = "none";
  document.body.style.overflow = "auto";
}

function refrescarListaEquiposAdmin() {
  listaEquiposAdmin.innerHTML = "";
  
  // Obtener todas las temporadas con equipos
  const temporadasConEquipos = Object.keys(temporadas)
    .filter(t => temporadas[t].equipos && temporadas[t].equipos.length > 0)
    .sort((a, b) => b - a); // Ordenar de más reciente a más antigua
  
  if (temporadasConEquipos.length === 0) {
    listaEquiposAdmin.innerHTML = "<p style='color: var(--text-muted);'>No hay equipos registrados</p>";
    return;
  }
  
  temporadasConEquipos.forEach((temporada) => {
    const divTemporada = document.createElement("div");
    divTemporada.className = "equipos-temporada-admin";
    divTemporada.style.marginBottom = "20px";
    
    const titulo = document.createElement("h5");
    titulo.textContent = `Temporada ${temporada}`;
    titulo.style.marginBottom = "10px";
    titulo.style.color = "var(--primary)";
    divTemporada.appendChild(titulo);
    
    const equipos = temporadas[temporada].equipos;
    equipos.forEach((equipo) => {
      const divEquipo = document.createElement("div");
      divEquipo.className = "equipo-admin-item";
      divEquipo.style.display = "flex";
      divEquipo.style.justifyContent = "space-between";
      divEquipo.style.alignItems = "center";
      divEquipo.style.padding = "8px";
      divEquipo.style.marginBottom = "5px";
      divEquipo.style.backgroundColor = "var(--bg-card)";
      divEquipo.style.borderRadius = "4px";
      
      const nombreEquipo = document.createElement("span");
      nombreEquipo.textContent = equipo;
      nombreEquipo.style.fontWeight = "500";
      
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn-accion btn-eliminar";
      btnEliminar.innerHTML = "🗑️ Eliminar";
      btnEliminar.style.fontSize = "0.85rem";
      btnEliminar.style.padding = "4px 8px";
      btnEliminar.onclick = () => eliminarEquipoAdmin(temporada, equipo);
      
      divEquipo.appendChild(nombreEquipo);
      divEquipo.appendChild(btnEliminar);
      divTemporada.appendChild(divEquipo);
    });
    
    listaEquiposAdmin.appendChild(divTemporada);
  });
}

function eliminarEquipoAdmin(temporada, nombreEquipo) {
  const confirma = confirm(
    `¿Eliminar el equipo "${nombreEquipo}" de la temporada ${temporada}?\n\nLos registros existentes seguirán teniendo ese equipo asignado, pero ya no podrás seleccionarlo en nuevos registros.`
  );
  
  if (!confirma) return;
  
  if (temporadas[temporada]?.equipos) {
    temporadas[temporada].equipos = temporadas[temporada].equipos.filter((e) => e !== nombreEquipo);
    
    // Si la temporada ya no tiene equipos, eliminar la clave
    if (temporadas[temporada].equipos.length === 0) {
      delete temporadas[temporada];
    }
    
    guardarEnStorage();
    refrescarListaEquiposAdmin();
    refrescarEquiposUI();
    pintarTablaEquipos();
  }
}

function refrescarListaConcursosAdmin() {
  listaConcursosAdmin.innerHTML = "";
  
  if (concursos.length === 0) {
    listaConcursosAdmin.innerHTML = "<p style='color: var(--text-muted);'>No hay concursos registrados</p>";
    return;
  }
  
  concursos
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .forEach((concurso) => {
      const div = document.createElement("div");
      div.className = "concurso-admin-item";
      
      const info = document.createElement("div");
      info.className = "concurso-admin-info";
      info.innerHTML = `
        <strong>${concurso.nombre}</strong>
        <small>📅 ${formatearFechaEspanol(concurso.fecha)} | Temporada ${concurso.temporada} | ${concurso.registros.length} registros</small>
      `;
      
      const actions = document.createElement("div");
      actions.className = "concurso-admin-actions";
      
      const btnEditar = document.createElement("button");
      btnEditar.className = "btn-admin-editar";
      btnEditar.textContent = "✏️ Editar";
      btnEditar.onclick = () => editarConcursoAdmin(concurso.id);
      
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn-admin-eliminar";
      btnEliminar.textContent = "🗑️ Eliminar";
      btnEliminar.onclick = () => eliminarConcursoAdmin(concurso.id);
      
      actions.appendChild(btnEditar);
      actions.appendChild(btnEliminar);
      
      div.appendChild(info);
      div.appendChild(actions);
      
      listaConcursosAdmin.appendChild(div);
    });
}

function editarConcursoAdmin(concursoId) {
  const concurso = concursos.find(c => c.id === concursoId);
  if (!concurso) return;
  
  const nuevaFecha = prompt("Nueva fecha (DD/MM/AAAA):", concurso.fecha);
  if (!nuevaFecha || nuevaFecha === concurso.fecha) return;
  
  const nuevoNombre = prompt("Nuevo nombre del concurso:", concurso.nombre);
  if (nuevoNombre === null) return;
  
  // Validar formato de fecha
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(nuevaFecha)) {
    alert("❌ Formato de fecha inválido. Usa DD/MM/AAAA (ejemplo: 14/01/2026)");
    return;
  }
  
  // Verificar si ya existe un concurso con esa fecha
  if (nuevaFecha !== concurso.fecha && concursos.find(c => c.id === nuevaFecha)) {
    alert("❌ Ya existe un concurso con esa fecha");
    return;
  }
  
  // Actualizar concurso
  concurso.fecha = nuevaFecha;
  concurso.nombre = nuevoNombre || `Concurso ${nuevaFecha}`;
  
  // Si cambió el ID (fecha), actualizar
  if (nuevaFecha !== concursoId) {
    concurso.id = nuevaFecha;
    if (concursoActivoId === concursoId) {
      concursoActivoId = nuevaFecha;
    }
  }
  
  guardarEnStorage();
  refrescarSelectConcursos();
  refrescarListaConcursosAdmin();
  alert("✅ Concurso actualizado correctamente");
}

function eliminarConcursoAdmin(concursoId) {
  const concurso = concursos.find(c => c.id === concursoId);
  if (!concurso) return;
  
  const confirma = confirm(
    `⚠️ ¿Eliminar el concurso "${concurso.nombre}"?\n\n` +
    `Fecha: ${formatearFechaEspanol(concurso.fecha)}\n` +
    `Registros: ${concurso.registros.length}\n\n` +
    `Esta acción NO se puede deshacer.`
  );
  
  if (!confirma) return;
  
  // Confirmar con el nombre del concurso
  const confirmaNombre = prompt(
    `Para confirmar, escribe el nombre del concurso:\n"${concurso.nombre}"`
  );
  
  if (confirmaNombre !== concurso.nombre) {
    alert("❌ Nombre incorrecto. Eliminación cancelada.");
    return;
  }
  
  // Eliminar concurso
  concursos = concursos.filter(c => c.id !== concursoId);
  
  // Si era el activo, seleccionar otro
  if (concursoActivoId === concursoId) {
    concursoActivoId = concursos.length > 0 ? concursos[0].id : null;
  }
  
  guardarEnStorage();
  refrescarSelectConcursos();
  refrescarZonasUI();
  refrescarEquiposUI();
  pintarTabla();
  pintarTablaEquipos();
  refrescarListaConcursosAdmin();
  
  alert("✅ Concurso eliminado correctamente");
}

// ---------------------- Concursos y temporadas ----------------------

function obtenerConcursoActivo() {
  return concursos.find((c) => c.id === concursoActivoId) || null;
}

function crearOSeleccionarConcurso() {
  const fecha = inputFechaConcurso.value.trim(); // formato DD/MM/YYYY
  let temporada = parseInt(inputTemporada.value, 10);

  // Validación obligatoria
  if (!fecha) {
    alert("⚠️ Falta la fecha del concurso. Por favor, introduce una fecha.");
    return;
  }

  // Validar formato DD/MM/YYYY
  const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regexFecha.test(fecha)) {
    alert("⚠️ Formato de fecha incorrecto. Usa DD/MM/AAAA (ejemplo: 14/01/2026)");
    return;
  }

  // Validar que la fecha sea válida
  const [dia, mes, anio] = fecha.split('/').map(num => parseInt(num, 10));
  const fechaObj = new Date(anio, mes - 1, dia);
  if (fechaObj.getDate() !== dia || fechaObj.getMonth() !== mes - 1 || fechaObj.getFullYear() !== anio) {
    alert("⚠️ La fecha introducida no es válida.");
    return;
  }

  if (isNaN(temporada)) {
    alert("⚠️ Falta la temporada. Por favor, introduce el año de la temporada.");
    return;
  }

  const id = fecha; // usamos la fecha como id
  let concurso = concursos.find((c) => c.id === id);

  if (!concurso) {
    const nombrePersonalizado = inputNombreConcurso.value.trim();
    const lugar = inputLugarConcurso.value.trim();
    const hora = inputHoraConcurso.value.trim();
    
    concurso = {
      id,
      fecha,
      temporada,
      nombre: nombrePersonalizado || `Concurso ${fecha}`,
      lugar: lugar || "No especificado",
      hora: hora || "No especificada",
      zonas: [],
      registros: [],
    };
    concursos.push(concurso);
    alert("✅ Concurso creado correctamente.");
  } else {
    // Si ya existe, actualizar los datos
    const nombrePersonalizado = inputNombreConcurso.value.trim();
    const lugar = inputLugarConcurso.value.trim();
    const hora = inputHoraConcurso.value.trim();
    
    if (nombrePersonalizado) concurso.nombre = nombrePersonalizado;
    if (lugar) concurso.lugar = lugar;
    if (hora) concurso.hora = hora;
    
    alert("✅ Concurso actualizado correctamente.");
  }

  // Asegurar que la temporada tenga estructura de equipos
  if (!temporadas[temporada]) {
    temporadas[temporada] = { equipos: [] };
  }

  concursoActivoId = concurso.id;
  guardarEnStorage();
  refrescarSelectConcursos();
  refrescarZonasUI();
  refrescarEquiposUI();
  pintarTabla();
  pintarTablaEquipos();
  habilitarBotonZonas();
  actualizarInfoConcursoActivo();
  
  // Limpiar los campos
  inputFechaConcurso.value = "";
  inputNombreConcurso.value = "";
  inputLugarConcurso.value = "";
  inputHoraConcurso.value = "";
}

function refrescarSelectConcursos() {
  selectConcurso.innerHTML = "";
  concursos
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.fecha} (Temp. ${c.temporada})`;
      if (c.id === concursoActivoId) opt.selected = true;
      selectConcurso.appendChild(opt);
    });
  
  habilitarBotonZonas();
}

function habilitarBotonZonas() {
  const concurso = obtenerConcursoActivo();
  
  if (concurso && btnToggleZonas) {
    btnToggleZonas.disabled = false;
    btnToggleZonas.style.opacity = "1";
    btnToggleZonas.style.cursor = "pointer";
  } else if (btnToggleZonas) {
    btnToggleZonas.disabled = true;
    btnToggleZonas.style.opacity = "0.5";
    btnToggleZonas.style.cursor = "not-allowed";
    // Ocultar sección de zonas si no hay concurso
    if (zonasConcursoSection) {
      zonasConcursoSection.style.display = "none";
    }
  }
}

function actualizarInfoConcursoActivo() {
  const concurso = obtenerConcursoActivo();
  
  if (!concurso || !infoConcursoActivo) {
    if (infoConcursoActivo) infoConcursoActivo.style.display = "none";
    return;
  }
  
  infoConcursoActivo.style.display = "block";
  infoNombre.textContent = concurso.nombre || "Sin nombre";
  infoFecha.textContent = formatearFechaEspanol(concurso.fecha) || "-";
  infoTemporada.textContent = concurso.temporada || "-";
  infoLugar.textContent = concurso.lugar || "No especificado";
  infoHora.textContent = concurso.hora || "No especificada";
  
  if (concurso.zonas && concurso.zonas.length > 0) {
    const zonasHTML = concurso.zonas.map((zona, index) => 
      `<div style="padding: 2px 0;">Zona ${index + 1}: ${zona}</div>`
    ).join("");
    infoZonas.innerHTML = zonasHTML;
  } else {
    infoZonas.textContent = "No hay zonas";
  }
}

// ---------------------- Zonas dinámicas ----------------------

function refrescarZonasUI() {
  const concurso = obtenerConcursoActivo();
  const zonas = concurso ? concurso.zonas : [];
  const tieneZonas = zonas.length > 0;

  // Mostrar/ocultar el campo de zona en el formulario según si hay zonas
  if (campoZonaContainer) {
    if (tieneZonas) {
      campoZonaContainer.style.display = "block";
      document.getElementById("zona").required = true;
    } else {
      campoZonaContainer.style.display = "none";
      document.getElementById("zona").required = false;
    }
  }

  // Lista de chips (ul)
  listaZonasUl.innerHTML = "";
  zonas.forEach((z) => {
    const li = document.createElement("li");
    li.textContent = z;
    li.title = "Click para eliminar esta zona";
    li.addEventListener("click", () => {
      eliminarZona(z);
    });
    listaZonasUl.appendChild(li);
  });

  // Select del formulario de pesaje
  const selectZonaForm = document.getElementById("zona");
  const selectZonaFiltro = document.getElementById("filtro-zona");

  // Reset options del formulario
  selectZonaForm.innerHTML = "";
  const optVacio = document.createElement("option");
  optVacio.value = "";
  optVacio.textContent = "Selecciona zona";
  selectZonaForm.appendChild(optVacio);

  zonas.forEach((z) => {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    selectZonaForm.appendChild(opt);
  });

  // Si hay zona fija activa, pre-seleccionarla y deshabilitar el select
  if (zonaFijaActiva && zonas.includes(zonaFijaActiva)) {
    selectZonaForm.value = zonaFijaActiva;
    selectZonaForm.disabled = true;
    selectZonaForm.style.background = "rgba(68, 196, 161, 0.2)";
  } else {
    selectZonaForm.disabled = false;
    selectZonaForm.style.background = "";
  }

  // Reset options del filtro
  selectZonaFiltro.innerHTML = "";
  const optTodas = document.createElement("option");
  optTodas.value = "todas";
  optTodas.textContent = "Todas las zonas";
  selectZonaFiltro.appendChild(optTodas);

  zonas.forEach((z) => {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    selectZonaFiltro.appendChild(opt);
  });

  // Actualizar selector de zona fija
  zonaFijaSelect.innerHTML = '<option value="">Sin zona fija (manual)</option>';
  zonas.forEach((z) => {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    if (z === zonaFijaActiva) opt.selected = true;
    zonaFijaSelect.appendChild(opt);
  });
}

// ---------------------- Equipos dinámicos ----------------------

function refrescarEquiposUI() {
  const concurso = obtenerConcursoActivo();
  const equipos = concurso ? concurso.equipos : [];

  // Lista de chips (ul)
  listaEquiposUl.innerHTML = "";
  equipos.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = e;
    li.title = "Click para eliminar este equipo";
    li.addEventListener("click", () => {
      eliminarEquipo(e);
    });
    listaEquiposUl.appendChild(li);
  });

  // Select del formulario de pesaje
  const selectEquipoForm = document.getElementById("equipo");

  // Reset options del formulario
  selectEquipoForm.innerHTML = "";
  const optSinEquipo = document.createElement("option");
  optSinEquipo.value = "";
  optSinEquipo.textContent = "Sin equipo";
  selectEquipoForm.appendChild(optSinEquipo);

  equipos.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e;
    opt.textContent = e;
    selectEquipoForm.appendChild(opt);
  });
}

function añadirEquipo(nombreEquipo) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("Primero crea o selecciona un concurso.");
    return;
  }

  const nombreLimpio = nombreEquipo.trim();
  if (!nombreLimpio) return;

  if (!concurso.equipos.includes(nombreLimpio)) {
    concurso.equipos.push(nombreLimpio);
    guardarEnStorage();
    refrescarEquiposUI();
  }
}

function eliminarEquipo(nombreEquipo) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) return;

  const confirmacion = confirm(
    `¿Eliminar el equipo "${nombreEquipo}"? Los registros existentes seguirán teniendo ese equipo, pero ya no podrás seleccionarlo.`
  );
  if (!confirmacion) return;

  concurso.equipos = concurso.equipos.filter((e) => e !== nombreEquipo);
  guardarEnStorage();
  refrescharEquiposUI();
  pintarTablaEquipos();
}

function añadirZona(nombreZona) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("Primero crea o selecciona un concurso.");
    return;
  }

  const nombreLimpio = nombreZona.trim();
  if (!nombreLimpio) return;

  if (!concurso.zonas.includes(nombreLimpio)) {
    concurso.zonas.push(nombreLimpio);
    guardarEnStorage();
    refrescarZonasUI();
    actualizarInfoConcursoActivo();
  }
}

function eliminarZona(nombreZona) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) return;

  const confirmacion = confirm(
    `¿Eliminar la zona "${nombreZona}"? Los registros existentes seguirán teniendo ese nombre, pero ya no podrás seleccionarla.`
  );
  if (!confirmacion) return;

  concurso.zonas = concurso.zonas.filter((z) => z !== nombreZona);
  guardarEnStorage();
  refrescarZonasUI();
  actualizarInfoConcursoActivo();
}

// ---------------------- Equipos dinámicos (por temporada) ----------------------

function refrescarEquiposUI() {
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    listaEquiposUl.innerHTML = "<li>Selecciona un concurso primero</li>";
    return;
  }
  
  const temporada = concurso.temporada;
  const equipos = temporadas[temporada]?.equipos || [];

  // Lista de chips (ul)
  listaEquiposUl.innerHTML = "";
  equipos.forEach((e) => {
    const li = document.createElement("li");
    li.className = "badge badge-equipos";
    li.textContent = e;
    li.title = "Equipo de la temporada";
    listaEquiposUl.appendChild(li);
  });

  // Select del formulario de pesaje
  const selectEquipoForm = document.getElementById("equipo");

  // Reset options del formulario
  selectEquipoForm.innerHTML = "";
  const optSinEquipo = document.createElement("option");
  optSinEquipo.value = "";
  optSinEquipo.textContent = "Sin equipo";
  selectEquipoForm.appendChild(optSinEquipo);

  equipos.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e;
    opt.textContent = e;
    selectEquipoForm.appendChild(opt);
  });
}

function añadirEquipo(nombreEquipo) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("Primero crea o selecciona un concurso.");
    return;
  }

  const nombreLimpio = nombreEquipo.trim();
  if (!nombreLimpio) return;

  const temporada = concurso.temporada;
  if (!temporadas[temporada]) {
    temporadas[temporada] = { equipos: [] };
  }

  if (!temporadas[temporada].equipos.includes(nombreLimpio)) {
    temporadas[temporada].equipos.push(nombreLimpio);
    guardarEnStorage();
    refrescarEquiposUI();
  }
}

function eliminarEquipo(nombreEquipo) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) return;

  const confirmacion = confirm(
    `¿Eliminar el equipo "${nombreEquipo}" de toda la temporada ${concurso.temporada}? Los registros existentes seguirán teniendo ese equipo, pero ya no podrás seleccionarlo.`
  );
  if (!confirmacion) return;

  const temporada = concurso.temporada;
  if (temporadas[temporada]?.equipos) {
    temporadas[temporada].equipos = temporadas[temporada].equipos.filter((e) => e !== nombreEquipo);
  }
  guardarEnStorage();
  refrescarEquiposUI();
  pintarTablaEquipos();
}

// ---------------------- Alta de registros y tabla concurso ----------------------

formPesaje.addEventListener("submit", (event) => {
  event.preventDefault();

  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("Primero crea o selecciona un concurso.");
    return;
  }

  const puesto = parseInt(document.getElementById("puesto").value, 10);
  const nombre = document.getElementById("nombre").value.trim().toUpperCase();
  const apellido1 = document.getElementById("apellido1").value.trim().toUpperCase();
  const apellido2 = document.getElementById("apellido2").value.trim().toUpperCase();
  const zonaElement = document.getElementById("zona");
  const zona = zonaElement.value || "Sin zona";
  const equipo = document.getElementById("equipo").value;
  const peso = parseInt(document.getElementById("peso").value, 10);
  const idEdicion = registroIdEdicion.value;

  // Validar campos obligatorios (zona es opcional si no hay zonas habilitadas)
  const tieneZonas = concurso.zonas && concurso.zonas.length > 0;
  if (!nombre || !apellido1 || isNaN(puesto) || isNaN(peso)) {
    alert("Rellena todos los campos obligatorios correctamente.");
    return;
  }
  
  if (tieneZonas && !zona) {
    alert("Selecciona una zona.");
    return;
  }

  // Modo edición
  if (idEdicion) {
    const registro = concurso.registros.find(r => r.id === parseInt(idEdicion, 10));
    if (registro) {
      registro.puesto = puesto;
      registro.nombre = nombre;
      registro.apellido1 = apellido1;
      registro.apellido2 = apellido2;
      registro.zona = zona;
      registro.equipo = equipo;
      registro.peso = peso;
      
      guardarEnStorage();
      formPesaje.reset();
      cancelarEdicion();
      pintarTabla();
      pintarTablaEquipos();
      return;
    }
  }

  // Modo nuevo registro
  const nuevoRegistro = {
    id: Date.now(),
    puesto,
    nombre,
    apellido1,
    apellido2,
    zona,
    equipo,
    peso,
  };

  concurso.registros.push(nuevoRegistro);
  guardarEnStorage();
  formPesaje.reset();
  pintarTabla();
  pintarTablaEquipos();
});

filtroZona.addEventListener("change", () => {
  pintarTabla();
});

// Pintar tabla para el concurso activo (y filtro de zona)
function pintarTabla() {
  const concurso = obtenerConcursoActivo();
  tablaBody.innerHTML = "";

  if (!concurso) {
    topConcursanteSpan.textContent = "Sin datos";
    return;
  }

  const zonaSeleccionada = filtroZona.value;
  let registrosFiltrados = concurso.registros.slice();

  if (zonaSeleccionada && zonaSeleccionada !== "todas") {
    registrosFiltrados = registrosFiltrados.filter(
      (r) => r.zona === zonaSeleccionada
    );
  }

  // Ordenar por peso descendente
  registrosFiltrados.sort((a, b) => b.peso - a.peso);

  registrosFiltrados.forEach((reg, index) => {
    const tr = document.createElement("tr");

    // Columna: Posición Final con medallas alineadas
    const tdPosicionFinal = document.createElement("td");
    const posicionFinal = index + 1;
    let medalla = "";
    if (posicionFinal === 1) medalla = "🥇";
    else if (posicionFinal === 2) medalla = "🥈";
    else if (posicionFinal === 3) medalla = "🥉";
    
    // Usar spans para alinear medalla y número
    tdPosicionFinal.innerHTML = medalla 
      ? `<span style="display: inline-block; width: 25px; text-align: center;">${medalla}</span><span style="font-weight: bold; font-size: 1.1em;">${posicionFinal}º</span>`
      : `<span style="display: inline-block; width: 25px;"></span><span>${posicionFinal}º</span>`;

    // Columna: Puesto original
    const tdPuesto = document.createElement("td");
    tdPuesto.textContent = reg.puesto;

    const tdNombre = document.createElement("td");
    tdNombre.textContent = reg.nombre;

    const tdApellidos = document.createElement("td");
    tdApellidos.textContent = `${reg.apellido1 || ''}${reg.apellido2 ? ' ' + reg.apellido2 : ''}`;

    const tdZona = document.createElement("td");
    tdZona.textContent = reg.zona;

    const tdEquipo = document.createElement("td");
    tdEquipo.textContent = reg.equipo || "-";
    tdEquipo.style.fontStyle = reg.equipo ? "normal" : "italic";
    tdEquipo.style.color = reg.equipo ? "inherit" : "var(--text-muted)";

    const tdPeso = document.createElement("td");
    tdPeso.textContent = reg.peso;

    const tdAcciones = document.createElement("td");
    
    // Botón editar
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-accion btn-editar";
    btnEditar.innerHTML = "✏️ Editar";
    btnEditar.onclick = () => editarRegistro(reg.id);
    
    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-accion btn-eliminar";
    btnEliminar.innerHTML = "🗑️ Eliminar";
    btnEliminar.onclick = () => eliminarRegistro(reg.id);
    
    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnEliminar);

    tr.appendChild(tdPosicionFinal);
    tr.appendChild(tdPuesto);
    tr.appendChild(tdNombre);
    tr.appendChild(tdApellidos);
    tr.appendChild(tdZona);
    tr.appendChild(tdEquipo);
    tr.appendChild(tdPeso);
    tr.appendChild(tdAcciones);

    tablaBody.appendChild(tr);
  });

  if (registrosFiltrados.length === 0) {
    topConcursanteSpan.textContent = "Sin datos";
  } else {
    const top = registrosFiltrados[0];
    const nombreCompleto = `${top.nombre} ${top.apellido1 || ''}${top.apellido2 ? ' ' + top.apellido2 : ''}`;
    topConcursanteSpan.textContent = `${nombreCompleto.trim()} (${top.zona}) - ${top.peso} g`;
  }
}

// ---------------------- Edición y eliminación de registros ----------------------

function editarRegistro(idRegistro) {
  // Solicitar contraseña antes de permitir edición
  const passwordIngresada = prompt("🔒 Introduce la contraseña de administrador para editar el registro:");
  
  if (!passwordIngresada) {
    return; // Usuario canceló
  }
  
  if (passwordIngresada !== obtenerPasswordActual()) {
    alert("❌ Contraseña incorrecta. No se puede editar el registro.");
    return;
  }

  const concurso = obtenerConcursoActivo();
  if (!concurso) return;

  const registro = concurso.registros.find(r => r.id === idRegistro);
  if (!registro) return;

  // Rellenar formulario con los datos del registro
  document.getElementById("puesto").value = registro.puesto;
  document.getElementById("nombre").value = registro.nombre;
  document.getElementById("apellido1").value = registro.apellido1 || "";
  document.getElementById("apellido2").value = registro.apellido2 || "";
  document.getElementById("zona").value = registro.zona;
  document.getElementById("equipo").value = registro.equipo || "";
  document.getElementById("peso").value = registro.peso;
  registroIdEdicion.value = registro.id;

  // Cambiar texto del botón y mostrar botón cancelar
  btnGuardarPesaje.innerHTML = "💾 Actualizar pesaje";
  btnCancelarEdicion.style.display = "block";

  // Hacer scroll al formulario
  formPesaje.scrollIntoView({ behavior: "smooth", block: "start" });
}

function eliminarRegistro(idRegistro) {
  const concurso = obtenerConcursoActivo();
  if (!concurso) return;

  const registro = concurso.registros.find(r => r.id === idRegistro);
  if (!registro) return;

  const confirma = confirm(
    `¿Eliminar el registro de ${registro.nombre} (Puesto ${registro.puesto}, ${registro.peso}g)?`
  );
  
  if (!confirma) return;

  // Solicitar contraseña antes de eliminar
  const passwordIngresada = prompt("🔒 Introduce la contraseña de administrador para eliminar el registro:");
  
  if (!passwordIngresada) {
    return; // Usuario canceló
  }
  
  if (passwordIngresada !== obtenerPasswordActual()) {
    alert("❌ Contraseña incorrecta. No se puede eliminar el registro.");
    return;
  }

  concurso.registros = concurso.registros.filter(r => r.id !== idRegistro);
  guardarEnStorage();
  pintarTabla();
  pintarTablaEquipos();
}

function cancelarEdicion() {
  registroIdEdicion.value = "";
  btnGuardarPesaje.innerHTML = "💾 Guardar pesaje";
  btnCancelarEdicion.style.display = "none";
  formPesaje.reset();
}

btnCancelarEdicion.addEventListener("click", cancelarEdicion);

// ---------------------- Tabla de clasificación de equipos ----------------------

function pintarTablaEquipos() {
  const concurso = obtenerConcursoActivo();
  tablaEquiposBody.innerHTML = "";

  if (!concurso || !concurso.registros || concurso.registros.length === 0) {
    mensajeSinEquipos.style.display = "block";
    document.querySelector("#tabla-clasificacion-equipos").parentElement.style.display = "none";
    return;
  }

  // Agrupar por equipo y sumar pesos
  const equiposData = {};
  
  concurso.registros.forEach((reg) => {
    if (reg.equipo && reg.equipo !== "") {
      if (!equiposData[reg.equipo]) {
        equiposData[reg.equipo] = {
          pesoTotal: 0,
          miembros: new Set()
        };
      }
      equiposData[reg.equipo].pesoTotal += reg.peso || 0;
      equiposData[reg.equipo].miembros.add(reg.nombre);
    }
  });

  // Convertir a array y ordenar
  const equiposArray = Object.entries(equiposData).map(([nombre, datos]) => ({
    nombre,
    pesoTotal: datos.pesoTotal,
    numMiembros: datos.miembros.size
  }));

  equiposArray.sort((a, b) => b.pesoTotal - a.pesoTotal);

  if (equiposArray.length === 0) {
    mensajeSinEquipos.style.display = "block";
    document.querySelector("#tabla-clasificacion-equipos").parentElement.style.display = "none";
    return;
  }

  mensajeSinEquipos.style.display = "none";
  document.querySelector("#tabla-clasificacion-equipos").parentElement.style.display = "block";

  // Renderizar filas
  equiposArray.forEach((equipo, index) => {
    const tr = document.createElement("tr");

    // Destacar los 3 primeros
    if (index === 0) tr.style.background = "rgba(255, 215, 0, 0.15)";
    else if (index === 1) tr.style.background = "rgba(192, 192, 192, 0.15)";
    else if (index === 2) tr.style.background = "rgba(205, 127, 50, 0.15)";

    const tdPos = document.createElement("td");
    if (index === 0) tdPos.innerHTML = "🥇 1";
    else if (index === 1) tdPos.innerHTML = "🥈 2";
    else if (index === 2) tdPos.innerHTML = "🥉 3";
    else tdPos.textContent = index + 1;

    const tdNombre = document.createElement("td");
    tdNombre.textContent = equipo.nombre;
    tdNombre.style.fontWeight = index < 3 ? "600" : "400";

    const tdPeso = document.createElement("td");
    tdPeso.textContent = equipo.pesoTotal.toLocaleString('es-ES');

    const tdMiembros = document.createElement("td");
    tdMiembros.textContent = equipo.numMiembros;

    const tdPromedio = document.createElement("td");
    const promedio = Math.round(equipo.pesoTotal / equipo.numMiembros);
    tdPromedio.textContent = promedio.toLocaleString('es-ES');

    tr.appendChild(tdPos);
    tr.appendChild(tdNombre);
    tr.appendChild(tdPeso);
    tr.appendChild(tdMiembros);
    tr.appendChild(tdPromedio);

    tablaEquiposBody.appendChild(tr);
  });
}

// ---------------------- Eventos concursos / temporadas ----------------------

btnNuevoConcurso.addEventListener("click", () => {
  crearOSeleccionarConcurso();
});

// Toggle para mostrar/ocultar sección de zonas del concurso
btnToggleZonas.addEventListener("click", () => {
  const concurso = obtenerConcursoActivo();
  
  if (!concurso) {
    alert("Primero crea o selecciona un concurso.");
    return;
  }
  
  if (zonasConcursoSection.style.display === "none") {
    zonasConcursoSection.style.display = "block";
    btnToggleZonas.textContent = "🗺️ Ocultar gestión de zonas";
  } else {
    zonasConcursoSection.style.display = "none";
    btnToggleZonas.textContent = "🗺️ Gestionar zonas del concurso";
  }
});

// Botón para cerrar gestión de zonas
if (btnToggleZonasCerrar) {
  btnToggleZonasCerrar.addEventListener("click", () => {
    zonasConcursoSection.style.display = "none";
    btnToggleZonas.textContent = "🗺️ Gestionar zonas del concurso";
  });
}

selectConcurso.addEventListener("change", () => {
  concursoActivoId = selectConcurso.value || null;
  guardarEnStorage();
  
  // Ocultar sección de zonas y resetear botón
  if (zonasConcursoSection) {
    zonasConcursoSection.style.display = "none";
    btnToggleZonas.textContent = "🗺️ Gestionar zonas del concurso";
  }
  
  habilitarBotonZonas();
  actualizarInfoConcursoActivo();
  refrescarZonasUI();
  refrescarEquiposUI();
  pintarTabla();
  pintarTablaEquipos();
});

// ---------------------- Eventos zonas ----------------------

btnAddZona.addEventListener("click", () => {
  añadirZona(inputNuevaZona.value);
  inputNuevaZona.value = "";
});

// ---------------------- Eventos equipos ----------------------

btnAddEquipo.addEventListener("click", () => {
  añadirEquipo(inputNuevoEquipo.value);
  inputNuevoEquipo.value = "";
});

// ---------------------- Modo Zona Fija (Multiusuario) ----------------------

btnActivarZonaFija.addEventListener("click", () => {
  const zonaSeleccionada = zonaFijaSelect.value;
  
  if (!zonaSeleccionada) {
    alert("Selecciona una zona primero.");
    return;
  }

  zonaFijaActiva = zonaSeleccionada;
  
  // Actualizar UI
  zonaFijaInfo.style.display = "block";
  zonaFijaNombre.textContent = zonaFijaActiva;
  btnActivarZonaFija.style.display = "none";
  btnDesactivarZonaFija.style.display = "inline-block";
  zonaFijaSelect.disabled = true;
  
  // Actualizar formulario
  refrescarZonasUI();
  
  // Notificación
  if ('vibrate' in navigator) {
    navigator.vibrate(200); // Feedback háptico en móvil
  }
});

btnDesactivarZonaFija.addEventListener("click", () => {
  zonaFijaActiva = null;
  
  // Actualizar UI
  zonaFijaInfo.style.display = "none";
  btnActivarZonaFija.style.display = "inline-block";
  btnDesactivarZonaFija.style.display = "none";
  zonaFijaSelect.disabled = false;
  zonaFijaSelect.value = "";
  
  // Actualizar formulario
  refrescarZonasUI();
});

// ---------------------- Imprimir clasificación del concurso ----------------------

const btnImprimirConcurso = document.getElementById("btn-imprimir-concurso");

if (btnImprimirConcurso) {
  btnImprimirConcurso.addEventListener("click", () => {
    const concurso = obtenerConcursoActivo();
    
    if (!concurso) {
      alert("No hay ningún concurso activo seleccionado.");
      return;
    }

    // Crear una ventana de impresión temporal
    const ventanaImpresion = window.open('', '_blank');
    
    const zonaSeleccionada = filtroZona.value;
    let registrosFiltrados = concurso.registros.slice();

    if (zonaSeleccionada && zonaSeleccionada !== "todas") {
      registrosFiltrados = registrosFiltrados.filter(
        (r) => r.zona === zonaSeleccionada
      );
    }

    registrosFiltrados.sort((a, b) => b.peso - a.peso);

    const contenidoHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Clasificación - ${concurso.nombre}</title>
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header-container {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .header-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }
          h1 {
            text-align: left;
            color: #333;
            margin: 0;
            font-size: 1.5rem;
          }
          h2 {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #333;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .medalla {
            display: inline-block;
            width: 25px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <img src="logo.jpg" alt="Logo UPP" class="header-logo" />
          <h1>Unión de Pescadores de Plasencia</h1>
        </div>
        <h2>Clasificación - ${concurso.nombre}</h2>
        <p><strong>Fecha:</strong> ${formatearFechaEspanol(concurso.fecha)} | <strong>Temporada:</strong> ${concurso.temporada}</p>
        <p><strong>Lugar:</strong> ${concurso.lugar || 'No especificado'} | <strong>Hora:</strong> ${concurso.hora || 'No especificada'}</p>
        <p><strong>Zona filtrada:</strong> ${zonaSeleccionada === "todas" || !zonaSeleccionada ? "Todas las zonas" : zonaSeleccionada}</p>
        
        <table>
          <thead>
            <tr>
              <th>Posición Final</th>
              <th>Puesto</th>
              <th>Nombre</th>
              <th>Zona</th>
              <th>Peso (g)</th>
            </tr>
          </thead>
          <tbody>
            ${registrosFiltrados.map((reg, index) => {
              const posicionFinal = index + 1;
              let medalla = "";
              if (posicionFinal === 1) medalla = "🥇";
              else if (posicionFinal === 2) medalla = "🥈";
              else if (posicionFinal === 3) medalla = "🥉";
              return `
              <tr>
                <td style="font-weight: ${posicionFinal <= 3 ? 'bold' : 'normal'}; font-size: ${posicionFinal <= 3 ? '1.1em' : '1em'};">
                  <span class="medalla">${medalla}</span>${posicionFinal}º
                </td>
                <td>${reg.puesto}</td>
                <td>${reg.nombre}</td>
                <td>${reg.zona}</td>
                <td>${reg.peso}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Documento generado el ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    ventanaImpresion.document.write(contenidoHTML);
    ventanaImpresion.document.close();
  });
}

// ---------------------- Exportar a Excel ----------------------

function exportarTablaAExcel(tableID, filename = "") {
  const tableSelect = document.getElementById(tableID);
  if (!tableSelect) {
    alert("No se encontró la tabla para exportar.");
    return;
  }

  // Clonar la tabla para no modificar el original
  const tableClone = tableSelect.cloneNode(true);
  
  // Eliminar la columna de "Acciones" (última columna)
  const rows = tableClone.querySelectorAll('tr');
  rows.forEach(row => {
    const lastCell = row.querySelector('th:last-child, td:last-child');
    if (lastCell && (lastCell.textContent.includes('Acciones') || lastCell.querySelector('.btn-accion'))) {
      lastCell.remove();
    }
  });

  const tableHTML = tableClone.outerHTML;
  const dataType = "application/vnd.ms-excel";
  const nombreArchivo = filename ? `${filename}.xls` : "clasificacion_pesca.xls";

  const blob = new Blob([tableHTML], { type: dataType });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, nombreArchivo);
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}

btnExportar.addEventListener("click", () => {
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("No hay concurso activo para exportar.");
    return;
  }

  const zonaSeleccionada = filtroZona.value;
  const sufijoZona =
    !zonaSeleccionada || zonaSeleccionada === "todas"
      ? "todas_zonas"
      : zonaSeleccionada.replace(/\s+/g, "_");

  const nombre = `clasificacion_${concurso.fecha}_temp${concurso.temporada}_${sufijoZona}`;

  exportarTablaAExcel("tabla-clasificacion", nombre);
});

// ---------------------- Menú desplegable ----------------------

// Abrir/cerrar menú
btnMenu.addEventListener("click", () => {
  menuDesplegable.style.display = "block";
  document.body.style.overflow = "hidden"; // Evitar scroll del fondo
});

btnCerrarMenu.addEventListener("click", () => {
  menuDesplegable.style.display = "none";
  document.body.style.overflow = "auto";
});

menuOverlay.addEventListener("click", () => {
  menuDesplegable.style.display = "none";
  document.body.style.overflow = "auto";
});

// Cerrar menú con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuDesplegable.style.display === "block") {
    cerrarMenu();
  }
});

// Función auxiliar para cerrar menú después de acción
function cerrarMenu() {
  menuDesplegable.style.display = "none";
  document.body.style.overflow = "auto";
}



// Ranking Individual
menuRankingIndividual.addEventListener("click", () => {
  cerrarMenu();
  window.open('ranking.html', '_blank', 'width=1000,height=800');
});

// Exportar Individual
menuExportarIndividual.addEventListener("click", () => {
  cerrarMenu();
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("No hay concurso activo para exportar.");
    return;
  }

  const zonaSeleccionada = filtroZona.value;
  const sufijoZona =
    !zonaSeleccionada || zonaSeleccionada === "todas"
      ? "todas_zonas"
      : zonaSeleccionada.replace(/\s+/g, "_");

  const nombre = `clasificacion_${concurso.fecha}_temp${concurso.temporada}_${sufijoZona}`;

  exportarTablaAExcel("tabla-clasificacion", nombre);
});

// Imprimir Individual
menuImprimirIndividual.addEventListener("click", () => {
  cerrarMenu();
  const concurso = obtenerConcursoActivo();
  
  if (!concurso) {
    alert("No hay ningún concurso activo seleccionado.");
    return;
  }

  // Crear una ventana de impresión temporal
  const ventanaImpresion = window.open('', '_blank');
  
  const zonaSeleccionada = filtroZona.value;
  let registrosFiltrados = concurso.registros.slice();

  if (zonaSeleccionada && zonaSeleccionada !== "todas") {
    registrosFiltrados = registrosFiltrados.filter(
      (r) => r.zona === zonaSeleccionada
    );
  }

  registrosFiltrados.sort((a, b) => b.peso - a.peso);

  const contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Clasificación - ${concurso.nombre}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header-container { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
        .header-logo { width: 60px; height: 60px; object-fit: contain; }
        h1 { text-align: left; margin: 0; font-size: 1.5rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        .medalla { display: inline-block; width: 25px; text-align: center; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header-container">
        <img src="logo.jpg" alt="Logo UPP" class="header-logo" />
        <h1>Unión de Pescadores de Plasencia</h1>
      </div>
      <h1 style="text-align: center; margin-top: 20px;">🏆 Clasificación Individual</h1>
      <p><strong>Concurso:</strong> ${concurso.nombre}</p>
      <p><strong>Fecha:</strong> ${formatearFechaEspanol(concurso.fecha)} | <strong>Temporada:</strong> ${concurso.temporada}</p>
      <p><strong>Lugar:</strong> ${concurso.lugar || 'No especificado'} | <strong>Hora:</strong> ${concurso.hora || 'No especificada'}</p>
      <p><strong>Zona:</strong> ${zonaSeleccionada === "todas" || !zonaSeleccionada ? "Todas las zonas" : zonaSeleccionada}</p>
      <table>
        <thead>
          <tr>
            <th>Posición Final</th>
            <th>Puesto</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Zona</th>
            <th>Equipo</th>
            <th>Peso (g)</th>
          </tr>
        </thead>
        <tbody>
          ${registrosFiltrados.map((r, index) => {
            const posicionFinal = index + 1;
            let medalla = "";
            if (posicionFinal === 1) medalla = "🥇";
            else if (posicionFinal === 2) medalla = "🥈";
            else if (posicionFinal === 3) medalla = "🥉";
            return `
            <tr>
              <td style="font-weight: ${posicionFinal <= 3 ? 'bold' : 'normal'}; font-size: ${posicionFinal <= 3 ? '1.1em' : '1em'};">
                <span class="medalla">${medalla}</span>${posicionFinal}º
              </td>
              <td>${r.puesto}</td>
              <td>${r.nombre}</td>
              <td>${r.apellido1} ${r.apellido2 || ''}</td>
              <td>${r.zona}</td>
              <td>${r.equipo || '-'}</td>
              <td>${r.peso.toLocaleString('es-ES')}</td>
            </tr>
          `}).join('')}
        </tbody>
      </table>
      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">🖨️ Imprimir</button>
    </body>
    </html>
  `;

  ventanaImpresion.document.write(contenidoHTML);
  ventanaImpresion.document.close();
});

// Ranking Equipos Temporada
menuRankingEquipos.addEventListener("click", () => {
  cerrarMenu();
  window.open('ranking-equipos.html', '_blank', 'width=1000,height=800');
});

// Exportar Equipos
menuExportarEquipos.addEventListener("click", () => {
  cerrarMenu();
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("No hay concurso activo para exportar.");
    return;
  }

  // Agrupar por equipo y generar datos para exportar
  const equiposData = {};
  
  concurso.registros.forEach((reg) => {
    if (reg.equipo && reg.equipo !== "") {
      if (!equiposData[reg.equipo]) {
        equiposData[reg.equipo] = {
          pesoTotal: 0,
          miembros: new Set()
        };
      }
      equiposData[reg.equipo].pesoTotal += reg.peso || 0;
      equiposData[reg.equipo].miembros.add(reg.nombre);
    }
  });

  // Convertir a array y ordenar
  const equiposArray = Object.entries(equiposData).map(([nombre, datos]) => ({
    nombre,
    pesoTotal: datos.pesoTotal,
    numMiembros: datos.miembros.size,
    promedio: Math.round(datos.pesoTotal / datos.miembros.size)
  }));

  equiposArray.sort((a, b) => b.pesoTotal - a.pesoTotal);

  // Crear CSV
  let csv = "Posición,Equipo,Peso Total (g),Nº Miembros,Promedio (g)\n";
  equiposArray.forEach((eq, index) => {
    csv += `${index + 1},"${eq.nombre}",${eq.pesoTotal},${eq.numMiembros},${eq.promedio}\n`;
  });

  // Descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `clasificacion_equipos_${concurso.fecha}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Imprimir Equipos
menuImprimirEquipos.addEventListener("click", () => {
  cerrarMenu();
  const concurso = obtenerConcursoActivo();
  if (!concurso) {
    alert("No hay concurso activo para imprimir.");
    return;
  }

  // Agrupar por equipo
  const equiposData = {};
  
  concurso.registros.forEach((reg) => {
    if (reg.equipo && reg.equipo !== "") {
      if (!equiposData[reg.equipo]) {
        equiposData[reg.equipo] = {
          pesoTotal: 0,
          miembros: new Set()
        };
      }
      equiposData[reg.equipo].pesoTotal += reg.peso || 0;
      equiposData[reg.equipo].miembros.add(reg.nombre);
    }
  });

  // Convertir a array y ordenar
  const equiposArray = Object.entries(equiposData).map(([nombre, datos]) => ({
    nombre,
    pesoTotal: datos.pesoTotal,
    numMiembros: datos.miembros.size
  }));

  equiposArray.sort((a, b) => b.pesoTotal - a.pesoTotal);

  // Crear ventana de impresión
  const ventana = window.open('', '_blank');
  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Clasificación por Equipos - ${formatearFechaEspanol(concurso.fecha)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <h1>🤝 Clasificación por Equipos</h1>
      <p><strong>Concurso:</strong> ${formatearFechaEspanol(concurso.fecha)} | <strong>Temporada:</strong> ${concurso.temporada}</p>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Equipo</th>
            <th>Peso Total (g)</th>
            <th>Nº Miembros</th>
          </tr>
        </thead>
        <tbody>
          ${equiposArray.map((eq, i) => `
            <tr>
              <td>${i === 0 ? '🥇 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : i + 1}</td>
              <td>${eq.nombre}</td>
              <td>${eq.pesoTotal.toLocaleString('es-ES')}</td>
              <td>${eq.numMiembros}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">🖨️ Imprimir</button>
    </body>
    </html>
  `);
  ventana.document.close();
});

// Borrar Histórico
menuBorrarHistorico.addEventListener("click", () => {
  cerrarMenu();
  
  // Primera advertencia
  const confirma = confirm(
    "⚠️ ADVERTENCIA CRÍTICA ⚠️\n\n" +
    "Esta acción borrará TODOS los concursos y datos almacenados.\n" +
    "Esta acción NO se puede deshacer.\n\n" +
    "Para continuar, deberás verificar tu identidad.\n\n" +
    "¿Deseas continuar?"
  );
  
  if (!confirma) return;

  // Solicitar contraseña de administrador
  const password = prompt(
    "🔐 VERIFICACIÓN DE SEGURIDAD\n\n" +
    "Introduce la contraseña de administrador para confirmar:\n\n" +
    "⚠️ SE BORRARÁN TODOS LOS DATOS"
  );
  
  if (password === null) {
    return; // Usuario canceló
  }
  
  if (password !== obtenerPasswordActual()) {
    alert("❌ Contraseña incorrecta. Operación cancelada.");
    return;
  }

  // Confirmación final
  const confirmacionFinal = confirm(
    "⚠️ ÚLTIMA CONFIRMACIÓN ⚠️\n\n" +
    "¿Estás COMPLETAMENTE SEGURO?\n\n" +
    "Se perderán:\n" +
    "• Todos los concursos\n" +
    "• Todos los registros de pesca\n" +
    "• Todos los equipos y temporadas\n" +
    "• TODO el histórico\n\n" +
    "Esta acción es IRREVERSIBLE.\n\n" +
    "Presiona ACEPTAR para BORRAR TODO"
  );

  if (!confirmacionFinal) {
    alert("✅ Operación cancelada. Los datos están seguros.");
    return;
  }

  // Borrar todo
  concursos = [];
  concursoActivoId = null;
  temporadas = {};
  localStorage.removeItem(STORAGE_KEY);
  
  // Refrescar UI
  refrescarSelectConcursos();
  refrescarZonasUI();
  refrescarEquiposUI();
  pintarTabla();
  pintarTablaEquipos();
  
  alert("✅ Histórico borrado completamente.\n\nTodos los datos han sido eliminados del sistema.");
});

// Gestionar Equipos
menuGestionarEquipos.addEventListener("click", () => {
  cerrarMenu();
  mostrarModalEquipos();
});

btnCerrarModalEquipos.addEventListener("click", () => {
  cerrarModalEquipos();
});

modalEquiposOverlay.addEventListener("click", () => {
  cerrarModalEquipos();
});

function mostrarModalEquipos() {
  modalEquipos.style.display = "block";
  document.body.style.overflow = "hidden";
  refrescarEquiposUI();
}

function cerrarModalEquipos() {
  modalEquipos.style.display = "none";
  document.body.style.overflow = "auto";
}

// Modo Administrador
menuAdmin.addEventListener("click", () => {
  cerrarMenu();
  mostrarModalAdmin();
});

btnCerrarModalAdmin.addEventListener("click", () => {
  cerrarModalAdmin();
});

modalAdminOverlay.addEventListener("click", () => {
  cerrarModalAdmin();
});

// Login de administrador
btnLoginAdmin.addEventListener("click", () => {
  const password = inputPasswordAdmin.value;
  
  if (password === obtenerPasswordActual()) {
    activarSesionAdmin();
    adminStatusText.textContent = "✅ Acceso concedido";
    adminStatusText.style.color = "var(--accent)";
    setTimeout(() => {
      mostrarModalAdmin();
    }, 500);
  } else {
    adminStatusText.textContent = "❌ Contraseña incorrecta";
    adminStatusText.style.color = "var(--danger)";
    inputPasswordAdmin.value = "";
    inputPasswordAdmin.focus();
  }
});

// Logout de administrador
btnLogoutAdmin.addEventListener("click", () => {
  cerrarSesionAdmin();
  cerrarModalAdmin();
  alert("✅ Sesión de administrador cerrada");
});

// Recuperar contraseña
if (btnRecuperarPassword) {
  btnRecuperarPassword.addEventListener("click", () => {
    const respuesta = prompt(`🔐 Pregunta de seguridad:\n\n${SECURITY_QUESTION}\n\n(Respuesta en minúsculas)`);
    
    if (respuesta === null) {
      return; // Usuario canceló
    }
    
    if (respuesta.toLowerCase().trim() === SECURITY_ANSWER) {
      const passwordActual = obtenerPasswordActual();
      alert(`✅ Respuesta correcta\n\n🔑 Tu contraseña es: ${passwordActual}\n\n⚠️ Te recomendamos cambiarla por seguridad.`);
      inputPasswordAdmin.value = passwordActual;
      inputPasswordAdmin.focus();
    } else {
      alert("❌ Respuesta incorrecta. No se puede recuperar la contraseña.\n\nContacta con el administrador del sistema.");
      adminStatusText.textContent = "❌ Respuesta de seguridad incorrecta";
      adminStatusText.style.color = "var(--danger)";
    }
  });
}

// Cambiar contraseña
if (btnCambiarPassword) {
  btnCambiarPassword.addEventListener("click", cambiarPassword);
}

// Enter en el campo de contraseña
inputPasswordAdmin.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btnLoginAdmin.click();
  }
});

// Cerrar modal admin con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modalAdmin.style.display === "block") {
      cerrarModalAdmin();
    }
    if (modalEquipos.style.display === "block") {
      cerrarModalEquipos();
    }
  }
});

// ---------------------- Gestión de Tema Claro/Oscuro ----------------------

function cargarTemaGuardado() {
  const temaGuardado = localStorage.getItem(THEME_KEY) || "dark";
  aplicarTema(temaGuardado);
}

function aplicarTema(tema) {
  const html = document.documentElement;
  
  if (tema === "light") {
    html.setAttribute("data-theme", "light");
    if (btnThemeToggle) btnThemeToggle.textContent = "☀️";
  } else {
    html.removeAttribute("data-theme");
    if (btnThemeToggle) btnThemeToggle.textContent = "🌙";
  }
  
  localStorage.setItem(THEME_KEY, tema);
}

function toggleTema() {
  const html = document.documentElement;
  const temaActual = html.getAttribute("data-theme") === "light" ? "light" : "dark";
  const nuevoTema = temaActual === "dark" ? "light" : "dark";
  aplicarTema(nuevoTema);
}

if (btnThemeToggle) {
  btnThemeToggle.addEventListener("click", toggleTema);
}

// ---------------------- Inicialización ----------------------

cargarTemaGuardado();
cargarDesdeStorage();
refrescarSelectConcursos();
refrescarZonasUI();
refrescarEquiposUI();
actualizarInfoConcursoActivo();
pintarTabla();
pintarTablaEquipos();
