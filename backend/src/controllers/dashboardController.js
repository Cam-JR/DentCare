import { db } from "../config/db.js";

// Estadísticas generales del sistema
export const getDashboardStats = async (req, res) => {
  try {
    const [pacientes] = await db.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'paciente'");
    const [admins] = await db.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'");
    const [citas] = await db.query("SELECT COUNT(*) AS total FROM citas");
    const [reportes] = await db.query("SELECT COUNT(*) AS total FROM reportes");

    res.status(200).json({
      pacientes: pacientes[0]?.total || 0,
      administradores: admins[0]?.total || 0,
      citas: citas[0]?.total || 0,
      reportes: reportes[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

// Últimas solicitudes registradas
export const getRecentRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        CONCAT(u.nombre, ' ', u.apellido) AS paciente,
        c.tipo_servicio,
        DATE_FORMAT(c.fecha, '%d/%m/%Y %H:%i') AS fecha
      FROM citas c
      JOIN usuarios u ON c.id_paciente = u.id
      ORDER BY c.fecha DESC
      LIMIT 5
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};
