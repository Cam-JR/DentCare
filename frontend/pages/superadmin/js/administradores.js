const tabla = document.getElementById("tabla-admins");
const token = localStorage.getItem("token");

async function cargarAdmins() {
  try {
    const res = await fetch("http://localhost:4000/api/superadmin/administradores", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al obtener administradores");

    tabla.innerHTML = "";
    data.forEach(admin => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${admin.nombre}</td>
        <td>${admin.correo}</td>
        <td>
          <span class="badge ${admin.activo ? 'bg-success' : 'bg-secondary'}">
            ${admin.activo ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editarAdmin('${admin._id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger me-1" onclick="eliminarAdmin('${admin._id}')">
            <i class="bi bi-trash"></i>
          </button>
          <button class="btn btn-sm btn-outline-${admin.activo ? 'secondary' : 'success'}" 
            onclick="toggleEstado('${admin._id}', ${!admin.activo})">
            <i class="bi ${admin.activo ? 'bi-x-circle' : 'bi-check-circle'}"></i>
          </button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar administradores</td></tr>`;
  }
}

async function eliminarAdmin(id) {
  if (!confirm("¿Eliminar este administrador?")) return;
  await fetch(`http://localhost:4000/api/superadmin/administradores/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  cargarAdmins();
}

async function toggleEstado(id, nuevoEstado) {
  await fetch(`http://localhost:4000/api/superadmin/administradores/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ activo: nuevoEstado })
  });
  cargarAdmins();
}

function editarAdmin(id) {
  window.location.href = `editar-admin.html?id=${id}`;
}

cargarAdmins();
