// ranking-equipos.js - Página de clasificación de equipos por temporada
const STORAGE_KEY = "clasificacion_pesca_upp_v2";

// Referencias DOM
const filtroTemporadaEquipos = document.getElementById("filtro-temporada-equipos");
const tablaEquiposBody = document.querySelector("#tabla-ranking-equipos tbody");
const btnExportarEquipos = document.getElementById("btn-exportar-equipos");
const btnImprimirEquipos = document.getElementById("btn-imprimir-equipos");
const mensajeSinDatos = document.getElementById("mensaje-sin-datos-equipos");
const equipoDetallesContainer = document.getElementById("equipo-detalles-container");

let concursos = [];

// ---------------------- Cargar datos ----------------------

function cargarDatos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      concursos = data.concursos || [];
    } catch (e) {
      console.error("Error al parsear storage", e);
      concursos = [];
    }
  }
}

// ---------------------- Renderizar temporadas ----------------------

function renderizarTemporadas() {
  filtroTemporadaEquipos.innerHTML = '<option value="">Selecciona una temporada</option>';
  
  const temporadas = Array.from(new Set(concursos.map((c) => c.temporada)))
    .sort((a, b) => b - a); // Orden descendente (más reciente primero)

  temporadas.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = String(t);
    opt.textContent = `Temporada ${t}`;
    filtroTemporadaEquipos.appendChild(opt);
  });

  // Seleccionar automáticamente la temporada más reciente si existe
  if (temporadas.length > 0) {
    filtroTemporadaEquipos.value = String(temporadas[0]);
    pintarRankingEquipos();
  }
}

// ---------------------- Pintar ranking de equipos ----------------------

function pintarRankingEquipos() {
  tablaEquiposBody.innerHTML = "";
  equipoDetallesContainer.innerHTML = "";
  const temporadaSeleccionada = filtroTemporadaEquipos.value;

  if (!temporadaSeleccionada) {
    mensajeSinDatos.style.display = "block";
    document.querySelector(".table-wrapper").style.display = "none";
    return;
  }

  const temporada = parseInt(temporadaSeleccionada, 10);
  
  // Filtrar concursos de esa temporada
  const concursosTemporada = concursos.filter((c) => c.temporada === temporada);

  if (concursosTemporada.length === 0) {
    mensajeSinDatos.style.display = "block";
    mensajeSinDatos.textContent = "📊 No hay datos para esta temporada";
    document.querySelector(".table-wrapper").style.display = "none";
    return;
  }

  // Agrupar por equipo y sumar peso total + contar miembros y concursos
  const datosPorEquipo = {};
  
  concursosTemporada.forEach((concurso) => {
    concurso.registros.forEach((reg) => {
      if (reg.equipo && reg.equipo !== "") {
        const nombreEquipo = reg.equipo;
        const peso = reg.peso || 0;
        
        if (!datosPorEquipo[nombreEquipo]) {
          datosPorEquipo[nombreEquipo] = {
            pesoTotal: 0,
            miembros: new Set(),
            concursosParticipados: new Set()
          };
        }
        
        datosPorEquipo[nombreEquipo].pesoTotal += peso;
        datosPorEquipo[nombreEquipo].miembros.add(reg.nombre);
        datosPorEquipo[nombreEquipo].concursosParticipados.add(concurso.id);
      }
    });
  });

  // Convertir a array
  const listaEquipos = Object.entries(datosPorEquipo).map(([nombre, datos]) => ({
    nombre,
    pesoTotal: datos.pesoTotal,
    numMiembros: datos.miembros.size,
    numConcursos: datos.concursosParticipados.size,
    miembros: Array.from(datos.miembros)
  }));

  // Ordenar por peso total descendente
  listaEquipos.sort((a, b) => b.pesoTotal - a.pesoTotal);

  if (listaEquipos.length === 0) {
    mensajeSinDatos.style.display = "block";
    mensajeSinDatos.textContent = "📊 No hay equipos registrados en esta temporada";
    document.querySelector(".table-wrapper").style.display = "none";
    return;
  }

  // Mostrar tabla y ocultar mensaje
  mensajeSinDatos.style.display = "none";
  document.querySelector(".table-wrapper").style.display = "block";

  // Renderizar filas
  listaEquipos.forEach((equipo, index) => {
    const tr = document.createElement("tr");

    // Destacar los 3 primeros puestos
    if (index === 0) tr.style.background = "rgba(255, 215, 0, 0.15)"; // Oro
    else if (index === 1) tr.style.background = "rgba(192, 192, 192, 0.15)"; // Plata
    else if (index === 2) tr.style.background = "rgba(205, 127, 50, 0.15)"; // Bronce

    const tdPos = document.createElement("td");
    if (index === 0) tdPos.innerHTML = "🥇 1";
    else if (index === 1) tdPos.innerHTML = "🥈 2";
    else if (index === 2) tdPos.innerHTML = "🥉 3";
    else tdPos.textContent = index + 1;

    const tdNombre = document.createElement("td");
    tdNombre.textContent = equipo.nombre;
    tdNombre.style.fontWeight = index < 3 ? "600" : "400";
    tdNombre.style.cursor = "pointer";
    tdNombre.title = "Click para ver detalles del equipo";
    tdNombre.onclick = () => mostrarDetallesEquipo(equipo, concursosTemporada);

    const tdPeso = document.createElement("td");
    tdPeso.textContent = equipo.pesoTotal.toLocaleString('es-ES');

    const tdMiembros = document.createElement("td");
    tdMiembros.textContent = equipo.numMiembros;

    const tdConcursos = document.createElement("td");
    tdConcursos.textContent = equipo.numConcursos;

    tr.appendChild(tdPos);
    tr.appendChild(tdNombre);
    tr.appendChild(tdPeso);
    tr.appendChild(tdMiembros);
    tr.appendChild(tdConcursos);

    tablaEquiposBody.appendChild(tr);
  });
}

// ---------------------- Mostrar detalles de equipo ----------------------

function mostrarDetallesEquipo(equipo, concursosTemporada) {
  equipoDetallesContainer.innerHTML = "";

  const detallesDiv = document.createElement("div");
  detallesDiv.className = "equipo-detalles";

  const titulo = document.createElement("h3");
  titulo.textContent = `🤝 Detalles de ${equipo.nombre}`;
  detallesDiv.appendChild(titulo);

  const info = document.createElement("p");
  info.innerHTML = `
    <strong>Peso total:</strong> ${equipo.pesoTotal.toLocaleString('es-ES')} g<br>
    <strong>Número de miembros:</strong> ${equipo.numMiembros}<br>
    <strong>Concursos participados:</strong> ${equipo.numConcursos}
  `;
  detallesDiv.appendChild(info);

  const miembrosTitulo = document.createElement("p");
  miembrosTitulo.innerHTML = "<strong>Miembros del equipo:</strong>";
  detallesDiv.appendChild(miembrosTitulo);

  const miembrosUl = document.createElement("ul");
  miembrosUl.className = "miembros-lista";
  
  equipo.miembros.forEach((miembro) => {
    const li = document.createElement("li");
    li.textContent = miembro;
    miembrosUl.appendChild(li);
  });
  
  detallesDiv.appendChild(miembrosUl);
  equipoDetallesContainer.appendChild(detallesDiv);

  // Scroll suave a los detalles
  detallesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------------- Exportar a Excel ----------------------

function exportarAExcel() {
  const temporadaSeleccionada = filtroTemporadaEquipos.value;
  
  if (!temporadaSeleccionada) {
    alert("Selecciona una temporada primero.");
    return;
  }

  const tabla = document.getElementById("tabla-ranking-equipos");
  let csv = [];
  
  // Título
  csv.push(`"Ranking de Equipos - Temporada ${temporadaSeleccionada}"`);
  csv.push(`"Unión de Pescadores de Plasencia"`);
  csv.push(""); // Línea vacía

  // Cabeceras
  const cabeceras = [];
  tabla.querySelectorAll("thead th").forEach((th) => {
    cabeceras.push(`"${th.textContent}"`);
  });
  csv.push(cabeceras.join(","));

  // Filas de datos
  tabla.querySelectorAll("tbody tr").forEach((tr) => {
    const fila = [];
    tr.querySelectorAll("td").forEach((td) => {
      // Limpiar emojis de medallas para el CSV
      let texto = td.textContent.replace(/[🥇🥈🥉]/g, '').trim();
      fila.push(`"${texto}"`);
    });
    csv.push(fila.join(","));
  });

  // Crear Blob y descargar
  const csvContent = csv.join("\n");
  const BOM = "\uFEFF"; // Para caracteres especiales en Excel
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `ranking_equipos_temporada_${temporadaSeleccionada}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------- Imprimir ----------------------

function imprimirRanking() {
  const temporadaSeleccionada = filtroTemporadaEquipos.value;
  
  if (!temporadaSeleccionada) {
    alert("Selecciona una temporada primero.");
    return;
  }

  window.print();
}

// ---------------------- Event Listeners ----------------------

filtroTemporadaEquipos.addEventListener("change", pintarRankingEquipos);
btnExportarEquipos.addEventListener("click", exportarAExcel);
btnImprimirEquipos.addEventListener("click", imprimirRanking);

// ---------------------- Inicialización ----------------------

cargarDatos();
renderizarTemporadas();
