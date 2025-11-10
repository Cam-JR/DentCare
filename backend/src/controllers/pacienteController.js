import { db } from "../config/db.js";// asegúrate de tener tu conexión MySQL configurada aquí
 
// 🟢 Obtener todos los pacientes
export const getPacientes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.nombre, 
        p.apellido, 
        p.dni, 
        p.telefono, 
        p.correo, 
        p.creado_en
      FROM pacientes p
      ORDER BY p.creado_en DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({ message: "Error al obtener pacientes" });
  }
};

// 🟠 Actualizar paciente
export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, telefono, correo } = req.body;

    const [result] = await db.query(
      `UPDATE pacientes 
       SET nombre = ?, apellido = ?, dni = ?, telefono = ?, correo = ?
       WHERE id = ?`,
      [nombre, apellido, dni, telefono, correo, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ message: "Paciente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(500).json({ message: "Error al actualizar paciente" });
  }
};

// 🔴 Eliminar paciente
export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM pacientes WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    res.status(500).json({ message: "Error al eliminar paciente" });
  }
};
