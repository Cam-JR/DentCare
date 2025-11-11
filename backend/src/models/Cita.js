// ../models/Cita.js
import { db } from "../config/db.js";

const Cita = {
  getAll: async () => {
    const query = `
      SELECT c.id, c.id_paciente, c.id_admin, c.id_especialidad,
             c.fecha_cita, c.estado, c.observaciones,
             p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
             a.nombre AS admin_nombre, a.apellido AS admin_apellido,
             e.nombre AS especialidad_nombre
      FROM citas c
      JOIN pacientes p ON c.id_paciente = p.id
      LEFT JOIN administradores a ON c.id_admin = a.id
      LEFT JOIN especialidades e ON c.id_especialidad = e.id
      ORDER BY c.fecha_cita DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT c.id, c.id_paciente, c.id_admin, c.id_especialidad,
             c.fecha_cita, c.estado, c.observaciones,
             p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
             a.nombre AS admin_nombre, a.apellido AS admin_apellido,
             e.nombre AS especialidad_nombre
      FROM citas c
      JOIN pacientes p ON c.id_paciente = p.id
      LEFT JOIN administradores a ON c.id_admin = a.id
      LEFT JOIN especialidades e ON c.id_especialidad = e.id
      WHERE c.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  create: async (cita) => {
    const query = `INSERT INTO citas SET ?`;
    const [result] = await db.query(query, [cita]);
    return { id: result.insertId, ...cita };
  },

  update: async (id, cita) => {
    const query = `UPDATE citas SET ? WHERE id = ?`;
    await db.query(query, [cita, id]);
    return { id, ...cita };
  },

  delete: async (id) => {
    const query = `DELETE FROM citas WHERE id = ?`;
    await db.query(query, [id]);
  },
};

export default Cita;
