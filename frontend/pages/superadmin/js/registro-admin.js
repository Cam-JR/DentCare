const form = document.getElementById("formAdmin");
const token = localStorage.getItem("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoAdmin = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    dni: form.dni.value,
    direccion: form.direccion.value,
    telefono: form.telefono.value,
    correo: form.correo.value,
    id_especialidad: form.id_especialidad.value || null,
    rol: form.rol.value,
    contrasena: form.contrasena.value
  };

  if (nuevoAdmin.contrasena.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/superadmin/crear-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoAdmin),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error al registrar administrador");

    alert("Administrador registrado con éxito");
    window.location.href = "administradores.html";
  } catch (error) {
    alert(error.message);
  }
});
