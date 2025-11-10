document.addEventListener("DOMContentLoaded", async () => {
  // ===============================
  // 🔹 ELEMENTOS DEL DOM
  // ===============================
  const container = document.getElementById("adminCardsContainer");
  const formCard = document.getElementById("formEditarAdminCard");
  const form = document.getElementById("formEditarAdmin");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnLogout = document.getElementById("btnLogout");
  const btnActualizar = document.getElementById("btnActualizar");
  const selectEspecialidad = document.getElementById("especialidad");

  let administradoresGlobal = [];
  let especialidadesGlobal = [];
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/frontend/pages/public/login.html";
    return;
  }

  // ===============================
  // 🦷 CARGAR ESPECIALIDADES
  // =============================== 

  // 🔹 Cargar especialidades cuando se abre el formulario
  async function cargarEspecialidades() {
    try {
      const res = await fetch("http://localhost:4000/api/especialidades");
      if (!res.ok) throw new Error("Error al obtener especialidades");
      const data = await res.json();

      // Limpiar el select antes de llenarlo
      selectEspecialidad.innerHTML = "<option value=''>Seleccione una especialidad</option>";

      data.forEach((esp) => {
        const option = document.createElement("option");
        option.value = esp.id;
        option.textContent = esp.nombre;
        selectEspecialidad.appendChild(option);
      });
    } catch (err) {
      console.error(err);
      alert("Error al cargar las especialidades");
    }
  }


  // ===============================
  // 📋 CARGAR Y MOSTRAR ADMINISTRADORES
  // ===============================
  async function cargarAdministradores() {
    container.innerHTML = `<div class="text-center text-muted w-100">Cargando administradores...</div>`;
    formCard.style.display = "none"; // Ocultar formulario al recargar

    try {
      const res = await fetch("http://localhost:4000/api/superadmin/administradores", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      administradoresGlobal = data;
      mostrarAdministradores(data);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
      container.innerHTML = `<div class="text-center text-danger w-100">Error al cargar administradores.</div>`;
    }
  }

  // 🧱 Renderizar cards de administradores
  function mostrarAdministradores(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
      container.innerHTML = `<div class="text-center text-muted w-100">No hay administradores registrados.</div>`;
      return;
    }

    container.innerHTML = "";
    lista.forEach((a) => {
      const card = document.createElement("div");
      card.className = "card card-admin col-md-4";
      const especialidadNombre = a.especialidad || obtenerNombreEspecialidad(a.id_especialidad);
      card.innerHTML = `
        <div class="card-body">
          <h5>${a.nombre} ${a.apellido || ""}</h5>
          <p class="especialidad">${especialidadNombre || "Sin especialidad"}</p>
          <p><strong>DNI:</strong> ${a.dni || "—"}</p>
          <p><strong>Correo:</strong> ${a.correo}</p>
          <p><strong>Teléfono:</strong> ${a.telefono || "—"}</p>
          <p><strong>Dirección:</strong> ${a.direccion || "—"}</p>
          <p class="text-muted small"><strong>Registrado:</strong> ${new Date(a.creado_en).toLocaleDateString()}</p>
          <div class="acciones">
            <button class="btn btn-sm btn-warning" onclick="editarAdmin(${a.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarAdmin(${a.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function obtenerNombreEspecialidad(idEspecialidad) {
    const esp = especialidadesGlobal.find((e) => e.id === idEspecialidad);
    return esp ? esp.nombre : "";
  }

  // ===============================
  // ✏️ EDITAR ADMINISTRADOR
  // ===============================
  window.editarAdmin = (id) => {
    const admin = administradoresGlobal.find((a) => a.id === id);
    if (!admin) return alert("Administrador no encontrado");

    document.getElementById("adminId").value = admin.id;
    document.getElementById("nombre").value = admin.nombre;
    document.getElementById("apellido").value = admin.apellido || "";
    document.getElementById("correo").value = admin.correo;
    document.getElementById("telefono").value = admin.telefono || "";
    document.getElementById("dni").value = admin.dni || "";
    document.getElementById("direccion").value = admin.direccion || "";

    // Asignar especialidad (por id)
    selectEspecialidad.value = admin.id_especialidad || "";

    formCard.style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // ===============================
  // 💾 GUARDAR CAMBIOS
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("adminId").value;

    const datos = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      correo: document.getElementById("correo").value,
      telefono: document.getElementById("telefono").value,
      dni: document.getElementById("dni").value,
      id_especialidad: document.getElementById("especialidad").value,
      direccion: document.getElementById("direccion").value,
    };

    try {
      const res = await fetch(`http://localhost:4000/api/superadmin/administradores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const data = await res.json();
      alert(data.message || "Administrador actualizado correctamente");
      formCard.style.display = "none";
      cargarAdministradores();
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      alert("Error al actualizar el administrador.");
    }
  });

  // ===============================
  // 🗑 ELIMINAR ADMINISTRADOR
  // ===============================
  window.eliminarAdmin = async (id) => {
    if (!confirm("¿Deseas eliminar este administrador?")) return;

    try {
      await fetch(`http://localhost:4000/api/superadmin/administradores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Administrador eliminado correctamente");
      cargarAdministradores();
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      alert("Error al eliminar el administrador.");
    }
  };

  // ===============================
  // ❌ CANCELAR EDICIÓN
  // ===============================
  btnCancelar.addEventListener("click", () => {
    form.reset();
    formCard.style.display = "none";
  });

  // ===============================
  // 🔄 ACTUALIZAR LISTA
  // ===============================
  btnActualizar.addEventListener("click", cargarAdministradores);

  // ===============================
  // 🚪 CERRAR SESIÓN
  // ===============================
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/frontend/pages/public/login.html";
  });

  // 🚀 Inicializar
  await cargarEspecialidades();
  await cargarAdministradores();
});
