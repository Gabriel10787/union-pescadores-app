// ranking.js - Página de clasificación general
const STORAGE_KEY = "clasificacion_pesca_upp_v2";

// Referencias DOM
const filtroTemporadaRanking = document.getElementById("filtro-temporada-ranking");
const tablaRankingBody = document.querySelector("#tabla-ranking-general tbody");
const btnExportarRanking = document.getElementById("btn-exportar-ranking");
const btnImprimirRanking = document.getElementById("btn-imprimir-ranking");
const mensajeSinDatos = document.getElementById("mensaje-sin-datos");

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
  filtroTemporadaRanking.innerHTML = '<option value="">Selecciona una temporada</option>';
  
  const temporadas = Array.from(new Set(concursos.map((c) => c.temporada)))
    .sort((a, b) => b - a); // Orden descendente (más reciente primero)

  temporadas.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = String(t);
    opt.textContent = `Temporada ${t}`;
    filtroTemporadaRanking.appendChild(opt);
  });

  // Seleccionar automáticamente la temporada más reciente si existe
  if (temporadas.length > 0) {
    filtroTemporadaRanking.value = String(temporadas[0]);
    pintarRanking();
  }
}

// ---------------------- Pintar ranking ----------------------

function pintarRanking() {
  tablaRankingBody.innerHTML = "";
  const temporadaSeleccionada = filtroTemporadaRanking.value;

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

  // Agrupar por nombre de concursante y sumar peso total + contar concursos
  const datosPorConcursante = concursosTemporada.reduce((acc, concurso) => {
    concurso.registros.forEach((reg) => {
      const nombre = reg.nombre;
      const peso = reg.peso || 0;
      
      if (!acc[nombre]) {
        acc[nombre] = {
          pesoTotal: 0,
          numConcursos: 0,
          concursosParticipados: new Set()
        };
      }
      
      acc[nombre].pesoTotal += peso;
      acc[nombre].concursosParticipados.add(concurso.id);
    });
    return acc;
  }, {});

  // Convertir a array y calcular número de concursos
  const lista = Object.entries(datosPorConcursante).map(([nombre, datos]) => ({
    nombre,
    pesoTotal: datos.pesoTotal,
    numConcursos: datos.concursosParticipados.size
  }));

  // Ordenar por peso total descendente
  lista.sort((a, b) => b.pesoTotal - a.pesoTotal);

  if (lista.length === 0) {
    mensajeSinDatos.style.display = "block";
    mensajeSinDatos.textContent = "📊 No hay registros de pesajes en esta temporada";
    document.querySelector(".table-wrapper").style.display = "none";
    return;
  }

  // Mostrar tabla y ocultar mensaje
  mensajeSinDatos.style.display = "none";
  document.querySelector(".table-wrapper").style.display = "block";

  // Renderizar filas
  lista.forEach((item, index) => {
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
    tdNombre.textContent = item.nombre;
    tdNombre.style.fontWeight = index < 3 ? "600" : "400";

    const tdPeso = document.createElement("td");
    tdPeso.textContent = item.pesoTotal.toLocaleString('es-ES');

    const tdConcursos = document.createElement("td");
    tdConcursos.textContent = item.numConcursos;

    tr.appendChild(tdPos);
    tr.appendChild(tdNombre);
    tr.appendChild(tdPeso);
    tr.appendChild(tdConcursos);

    tablaRankingBody.appendChild(tr);
  });
}

// ---------------------- Exportar a Excel ----------------------

function exportarAExcel() {
  const temporadaSeleccionada = filtroTemporadaRanking.value;
  
  if (!temporadaSeleccionada) {
    alert("Selecciona una temporada primero.");
    return;
  }

  const tabla = document.getElementById("tabla-ranking-general");
  let csv = [];
  
  // Título
  csv.push(`"Ranking General - Temporada ${temporadaSeleccionada}"`);
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
  link.setAttribute("download", `ranking_temporada_${temporadaSeleccionada}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------- Imprimir ----------------------

function imprimirRanking() {
  const temporadaSeleccionada = filtroTemporadaRanking.value;
  
  if (!temporadaSeleccionada) {
    alert("Selecciona una temporada primero.");
    return;
  }

  window.print();
}

// ---------------------- Event Listeners ----------------------

filtroTemporadaRanking.addEventListener("change", pintarRanking);
btnExportarRanking.addEventListener("click", exportarAExcel);
btnImprimirRanking.addEventListener("click", imprimirRanking);

// ---------------------- Inicialización ----------------------

cargarDatos();
renderizarTemporadas();
