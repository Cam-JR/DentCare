// ===============================
// SUPERADMIN DASHBOARD LOGIC
// ===============================

const API_URL = "http://localhost:4000/api";

// Elementos del DOM
const nombreUsuario = document.getElementById("nombre-usuario");
const btnLogout = document.getElementById("btnLogout");
const countPacientes = document.getElementById("countPacientes");
const countCitas = document.getElementById("countCitas");
const countReportes = document.getElementById("countReportes");
const countAdmins = document.getElementById("countAdmins");
const listaSolicitudes = document.getElementById("listaSolicitudes");

// ===============================
// 🔐 VALIDAR TOKEN Y ROL
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "/frontend/pages/public/login.html";
    return;
  }

  const payload = parseJwt(token);
  if (payload.rol !== "superadmin") {
    alert("Acceso denegado. Solo el Superadministrador puede acceder.");
    localStorage.removeItem("token");
    window.location.href = "/frontend/pages/public/login.html";
    return;
  }

  nombreUsuario.textContent = payload.nombre || "Superadmin";
  await cargarEstadisticas(token);
  await cargarSolicitudes(token);
});

// 📊 CARGAR ESTADÍSTICAS
async function cargarEstadisticas(token) {
  try {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error al obtener estadísticas");

    countPacientes.textContent = data.pacientes ?? 0;
    countCitas.textContent = data.citas ?? 0;
    countReportes.textContent = data.reportes ?? 0;
    countAdmins.textContent = data.administradores ?? 0;
  } catch (error) {
    console.error("❌ Error cargando estadísticas:", error);
  }
}

// 🕒 CARGAR SOLICITUDES RECIENTES
async function cargarSolicitudes(token) {
  try {
    const res = await fetch(`${API_URL}/dashboard/solicitudes-recientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const solicitudes = await res.json();
    listaSolicitudes.innerHTML = "";

    if (!res.ok || solicitudes.length === 0) {
      listaSolicitudes.innerHTML =
        '<li class="list-group-item text-muted">No hay solicitudes recientes.</li>';
      return;
    }

    solicitudes.forEach((s) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <i class="bi bi-person-circle me-2 text-primary"></i>
        <strong>${s.paciente}</strong> solicitó <em>${s.tipo_servicio}</em>
        <span class="text-muted small d-block">${s.fecha}</span>
      `;
      listaSolicitudes.appendChild(li);
    });
  } catch (error) {
    console.error("❌ Error cargando solicitudes:", error);
  }
}

// ===============================
// 🚪 CERRAR SESIÓN
// ===============================
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/frontend/pages/public/login.html";
});

// ===============================
// 🧩 FUNCIONES AUXILIARES
// ===============================
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando token:", e);
    return {};
  }
} 
