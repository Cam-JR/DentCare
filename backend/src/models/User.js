import { db } from '../config/db.js';

export class User {
  static async create({ nombre, correo, contrasena, rol }) {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasena, rol]
    );
    return result.insertId;
  }

  static async findByEmail(correo) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0];
  }
}
 
