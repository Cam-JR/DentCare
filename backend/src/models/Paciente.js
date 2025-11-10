// backend/models/Paciente.js
import { db } from '../config/db.js';

export const Paciente = {
  create: async ({ id_usuario, nombre, apellido, dni, telefono, correo }) => {
    const [result] = await db.query(
      `INSERT INTO pacientes (id_usuario, nombre, apellido, dni, telefono, correo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, nombre, apellido, dni, telefono, correo]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM pacientes");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM pacientes WHERE id = ?", [id]);
    return rows[0];
  }
};
