const API_URL = "http://localhost:4000/api";
const tablaCitas = document.getElementById("tabla-citas");
const formEditarCita = document.getElementById("formEditarCita");
const btnLogout = document.getElementById("btnLogout");
let modalCita = new bootstrap.Modal(document.getElementById("modalCita"));
let citaActual = null;

// 🆕 Obtener token
const token = localStorage.getItem("token");

// 🆕 Verificar autenticación
if (!token) {
  window.location.href = "/frontend/pages/public/login.html";
}

// =============================
// 🔹 Cargar datos al iniciar
// =============================
document.addEventListener("DOMContentLoaded", () => {
  cargarCitas();
  cargarAdmins();
  cargarEspecialidades();
});

// =============================
// 🔹 Obtener y mostrar citas
// =============================
async function cargarCitas() {
  tablaCitas.innerHTML = `
    <tr><td colspan="7" class="text-center text-muted py-4">Cargando citas...</td></tr>
  `;

  try {
    const res = await fetch(`${API_URL}/citas`, {
      headers: { 
        "Authorization": `Bearer ${token}` // 🆕 Agregar token
      }
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const citas = await res.json();

    if (!citas.length) {
      tablaCitas.innerHTML = `
        <tr><td colspan="7" class="text-center text-muted py-4">No hay citas registradas</td></tr>
      `;
      return;
    }

    tablaCitas.innerHTML = "";
    citas.forEach(cita => {
      const badgeClass = {
        pendiente: "badge-pendiente",
        confirmada: "badge-confirmada",
        cancelada: "badge-cancelada",
        completada: "badge-completada",
      }[cita.estado] || "badge-pendiente";

      // 🆕 Formatear fecha correctamente
      const fecha = new Date(cita.fecha_cita);
      const fechaFormateada = fecha.toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      tablaCitas.innerHTML += `
        <tr>
          <td>${cita.id}</td>
          <td>${cita.paciente_nombre || "—"} ${cita.paciente_apellido || ""}</td>
          <td>${cita.admin_nombre ? `${cita.admin_nombre} ${cita.admin_apellido || ""}` : "Sin asignar"}</td>
          <td>${cita.especialidad_nombre || "—"}</td>
          <td>${fechaFormateada}</td>
          <td><span class="badge ${badgeClass}">${cita.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarCita(${cita.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCita(${cita.id})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al cargar citas:", err);
    tablaCitas.innerHTML = `
      <tr><td colspan="7" class="text-center text-danger">Error al cargar citas: ${err.message}</td></tr>
    `;
  }
}

// =============================
// 🔹 Cargar listas (admins, especialidades)
// =============================
async function cargarAdmins() {
  const select = document.getElementById("editar-admin");
  try {
    const res = await fetch(`${API_URL}/superadmin/administradores`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error al cargar administradores");

    const data = await res.json();
    const admins = data.data || data;

    select.innerHTML = `<option value="">Sin asignar</option>`;
    admins.forEach(a => {
      select.innerHTML += `<option value="${a.id}">${a.nombre} ${a.apellido || ""}</option>`;
    });
  } catch (err) {
    console.error("Error al cargar administradores:", err);
    select.innerHTML = `<option value="">Error al cargar</option>`;
  }
}

async function cargarEspecialidades() {
  const select = document.getElementById("editar-especialidad");
  try {
    const res = await fetch(`${API_URL}/especialidades`);
    
    if (!res.ok) throw new Error("Error al cargar especialidades");

    const data = await res.json();
    select.innerHTML = `<option value="">Seleccione especialidad</option>`;
    data.forEach(e => {
      select.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
    });
  } catch (err) {
    console.error("Error al cargar especialidades:", err);
    select.innerHTML = `<option value="">Error al cargar</option>`;
  }
}

// =============================
// 🔹 Editar cita (abrir modal)
// =============================
async function editarCita(id) {
  try {
    const res = await fetch(`${API_URL}/citas/${id}`, {
      headers: { 
        "Authorization": `Bearer ${token}` // 🆕 Agregar token
      }
    });

    if (!res.ok) throw new Error("Error al obtener la cita");

    const cita = await res.json();
    citaActual = cita;

    console.log("📋 Cita obtenida:", cita); // 🆕 Debug

    document.getElementById("editar-id").value = cita.id;
    document.getElementById("editar-paciente").value = `${cita.paciente_nombre} ${cita.paciente_apellido || ""}`;
    document.getElementById("editar-admin").value = cita.id_admin || "";
    document.getElementById("editar-especialidad").value = cita.id_especialidad || "";
    
    // 🆕 CORRECCIÓN: Convertir fecha de MySQL a formato datetime-local
    const fecha = new Date(cita.fecha_cita);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    
    const fechaFormateada = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log("📅 Fecha formateada para input:", fechaFormateada); // 🆕 Debug
    
    document.getElementById("editar-fecha").value = fechaFormateada;
    document.getElementById("editar-estado").value = cita.estado;
    document.getElementById("editar-observaciones").value = cita.observaciones || "";

    modalCita.show();
  } catch (err) {
    console.error("Error al obtener cita:", err);
    alert("Error al cargar los datos de la cita: " + err.message);
  }
}

// =============================
// 🔹 Guardar cambios
// =============================
formEditarCita.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editar-id").value;
  const fechaInput = document.getElementById("editar-fecha").value;

  if (!fechaInput) {
    alert("Debes ingresar una fecha válida");
    return;
  }

  const idAdmin = document.getElementById("editar-admin").value;
  const idEspecialidad = document.getElementById("editar-especialidad").value;

  // 🆕 Convertir formato datetime-local a MySQL datetime
  const fechaMySQL = fechaInput.replace("T", " ") + ":00";

  const citaActualizada = {
    fecha_cita: fechaMySQL,
    id_admin: idAdmin !== "" ? parseInt(idAdmin) : null,
    id_especialidad: idEspecialidad !== "" ? parseInt(idEspecialidad) : null,
    estado: document.getElementById("editar-estado").value,
    observaciones: document.getElementById("editar-observaciones").value || null,
  };

  console.log("📤 Enviando datos:", citaActualizada); // 🆕 Debug

  try {
    const res = await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🆕 Importante
      },
      body: JSON.stringify(citaActualizada),
    });

    const data = await res.json();
    
    console.log("📥 Respuesta del servidor:", data); // 🆕 Debug

    if (!res.ok) {
      throw new Error(data.error || data.message || "Error al actualizar cita");
    }

    modalCita.hide();
    await cargarCitas();
    alert(data.message || "Cita actualizada correctamente");
  } catch (err) {
    console.error("❌ Error al actualizar cita:", err);
    alert("Error al guardar los cambios: " + err.message);
  }
});

// =============================
// 🔹 Eliminar cita
// =============================
async function eliminarCita(id) {
  if (!confirm("¿Deseas eliminar esta cita?")) return;

  try {
    const res = await fetch(`${API_URL}/citas/${id}`, { 
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}` // 🆕 Agregar token
      }
    });

    if (!res.ok) throw new Error("Error al eliminar cita");

    await cargarCitas();
    alert("Cita eliminada correctamente");
  } catch (err) {
    console.error("Error al eliminar cita:", err);
    alert("Error al eliminar cita: " + err.message);
  }
}

// 🔄 ACTUALIZAR LISTA
  document.getElementById("btnActualizar").addEventListener("click", cargarCitas);

// =============================
// 🔹 Cerrar sesión
// =============================
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/frontend/pages/public/login.html";
});