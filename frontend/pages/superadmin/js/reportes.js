// ==========================
// 📊 Inicialización de gráficos
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  cargarGraficos();
  cargarReportes();
});

// Simulación de datos (hasta conectar con backend)
const datosCitasEstado = {
  labels: ["Pendientes", "Atendidas", "Canceladas"],
  values: [4, 10, 2],
};

const datosCitasMes = {
  labels: ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"],
  values: [8, 12, 9, 14, 11, 6],
};

// ==========================
// 🎨 Función para crear los gráficos
// ==========================
function cargarGraficos() {
  const ctx1 = document.getElementById("chartCitasEstado").getContext("2d");
  new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: datosCitasEstado.labels,
      datasets: [
        {
          data: datosCitasEstado.values,
          backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
        },
      ],
    },
  });

  const ctx2 = document.getElementById("chartCitasMes").getContext("2d");
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: datosCitasMes.labels,
      datasets: [
        {
          label: "Citas",
          data: datosCitasMes.values,
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      scales: { y: { beginAtZero: true } },
    },
  });
}

// ==========================
// 📋 Cargar reportes en tabla
// ==========================
function cargarReportes() {
  const tabla = document.querySelector("#tablaReportes tbody");

  // Datos simulados (después se reemplaza con fetch)
  const reportes = [
    {
      id: 1,
      paciente: "Ana López",
      descripcion: "Dolor en molar superior derecho. Se diagnosticó caries.",
      fecha: "2025-11-08",
    },
    {
      id: 2,
      paciente: "Juan Pérez",
      descripcion: "Control de limpieza dental. Todo en orden.",
      fecha: "2025-11-09",
    },
  ];

  tabla.innerHTML = reportes
    .map(
      (r) => `
      <tr>
        <td>${r.id}</td>
        <td>${r.paciente}</td>
        <td>${r.descripcion}</td>
        <td>${new Date(r.fecha).toLocaleDateString("es-ES")}</td>
      </tr>
    `
    )
    .join("");
}

// ==========================
// 📅 Filtro de fechas (solo visual)
// ==========================
document.getElementById("btnFiltrar").addEventListener("click", () => {
  const inicio = document.getElementById("fechaInicio").value;
  const fin = document.getElementById("fechaFin").value;

  if (!inicio || !fin) {
    alert("Por favor, selecciona un rango de fechas.");
    return;
  }

  alert(`Filtrando reportes desde ${inicio} hasta ${fin}`);
});
