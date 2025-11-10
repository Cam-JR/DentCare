import {
  obtenerAdministradores,
  obtenerAdministradorPorId,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador
} from "../models/Administrador.js";

export async function listarAdministradores(req, res) {
  try {
    const administradores = await obtenerAdministradores();
    res.json(administradores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los administradores" });
  }
}

export async function crear(req, res) {
  try {
    const id = await crearAdministrador(req.body);
    res.json({ mensaje: "Administrador creado", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el administrador" });
  }
}

export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    await actualizarAdministrador(id, req.body);
    res.json({ mensaje: "Administrador actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el administrador" });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    await eliminarAdministrador(id);
    res.json({ mensaje: "Administrador eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el administrador" });
  }
}
