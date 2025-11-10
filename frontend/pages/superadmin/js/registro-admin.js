const form = document.getElementById("formAdmin");
const token = localStorage.getItem("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoAdmin = {
    nombre: form.nombre.value,
    correo: form.correo.value,
    contrasena: form.contrasena.value,
  };

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
