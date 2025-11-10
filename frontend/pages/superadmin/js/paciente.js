document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorPacientes");
  const formEditar = document.getElementById("formEditarPaciente");
  const form = document.getElementById("editarPacienteForm");
  const btnLogout = document.getElementById("btnLogout");
  const filtroDni = document.getElementById("filtroDni");
  const btnBuscarDni = document.getElementById("btnBuscarDni");
  const btnLimpiarFiltro = document.getElementById("btnLimpiarFiltro");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/frontend/pages/public/login.html";
    return;
  }

  let pacientesGlobal = []; // almacenará todos los pacientes para filtrar

  async function cargarPacientes() {
    contenedor.innerHTML = `<div class="text-center text-muted w-100">Cargando pacientes...</div>`;

    try {
      const res = await fetch("http://localhost:4000/api/superadmin/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      pacientesGlobal = data; // guardar lista completa
      mostrarPacientes(data);
    } catch (error) {
      contenedor.innerHTML = `<div class="text-center text-danger w-100">Error al cargar pacientes.</div>`;
      console.error(error);
    }
  }

  // 🧱 Función para renderizar pacientes
  function mostrarPacientes(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
      contenedor.innerHTML = `<div class="text-center text-muted w-100">No hay pacientes registrados.</div>`;
      return;
    }

    contenedor.innerHTML = "";
    lista.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card card-paciente col-md-4";
      card.innerHTML = `
        <div class="card-body">
          <h5>${p.nombre} ${p.apellido || ""}</h5>
          <p><strong>DNI:</strong> ${p.dni || "—"}</p>
          <p><strong>Correo:</strong> ${p.correo}</p>
          <p><strong>Teléfono:</strong> ${p.telefono || "—"}</p>
          <p class="text-muted small"><strong>Registrado:</strong> ${new Date(p.creado_en).toLocaleDateString()}</p>
          <div class="acciones">
            <button class="btn btn-sm btn-warning" onclick="editarPaciente(${p.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarPaciente(${p.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });
  }

  // 🔍 Buscar por DNI
  btnBuscarDni.addEventListener("click", () => {
    const dni = filtroDni.value.trim();
    if (!dni) return alert("Ingrese un DNI para buscar");

    const filtrados = pacientesGlobal.filter(
      (p) => p.dni && p.dni.toLowerCase().includes(dni.toLowerCase())
    );

    if (filtrados.length === 0) {
      contenedor.innerHTML = `<div class="text-center text-muted w-100">No se encontraron pacientes con ese DNI.</div>`;
    } else {
      mostrarPacientes(filtrados);
    }
  });

  // 🔄 Limpiar filtro
  btnLimpiarFiltro.addEventListener("click", () => {
    filtroDni.value = "";
    mostrarPacientes(pacientesGlobal);
  });

  // ===============================
  // ✏️ EDITAR PACIENTE
  // ===============================
  window.editarPaciente = async (id) => {
    const paciente = pacientesGlobal.find((p) => p.id === id);
    if (!paciente) return alert("Paciente no encontrado");

    formEditar.style.display = "block";
    document.getElementById("pacienteId").value = paciente.id;
    document.getElementById("nombre").value = paciente.nombre;
    document.getElementById("apellido").value = paciente.apellido || "";
    document.getElementById("dni").value = paciente.dni || "";
    document.getElementById("telefono").value = paciente.telefono || "";
    document.getElementById("correo").value = paciente.correo;
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // 💾 GUARDAR CAMBIOS
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("pacienteId").value;
    const body = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      dni: document.getElementById("dni").value,
      telefono: document.getElementById("telefono").value,
      correo: document.getElementById("correo").value,
    };

    const res = await fetch(`http://localhost:4000/api/superadmin/pacientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    alert(data.message || "Cambios guardados correctamente");
    formEditar.style.display = "none";
    cargarPacientes();
  });

  // 🗑 ELIMINAR PACIENTE
  window.eliminarPaciente = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este paciente?")) return;

    await fetch(`http://localhost:4000/api/superadmin/pacientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    cargarPacientes();
  };

  // ❌ CANCELAR EDICIÓN
  document.getElementById("cancelarEdicion").addEventListener("click", () => {
    formEditar.style.display = "none";
  });

  // 🔄 ACTUALIZAR LISTA
  document.getElementById("btnActualizar").addEventListener("click", cargarPacientes);

  // 🚪 CERRAR SESIÓN
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/frontend/pages/public/login.html";
  });

  cargarPacientes();
});
