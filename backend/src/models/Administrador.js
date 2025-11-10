import { db } from "../config/db.js";

// ==================================================
// 📋 Obtener todos los administradores (con su especialidad)
// ==================================================
export async function obtenerAdministradores() {
  const [rows] = await db.query(`
    SELECT 
      a.id,
      a.usuario_id,
      a.nombre,
      a.apellido,
      a.dni,
      a.direccion,
      a.telefono,
      a.correo,
      a.creado_en,
      e.id AS id_especialidad,
      e.nombre AS especialidad
    FROM administradores a
    LEFT JOIN especialidades e ON a.id_especialidad = e.id
    ORDER BY a.id DESC
  `);
  return rows;
}

// ==================================================
// 🔍 Obtener un administrador por ID
// ==================================================
export async function obtenerAdministradorPorId(id) {
  const [rows] = await db.query(`
    SELECT 
      a.id,
      a.usuario_id,
      a.nombre,
      a.apellido,
      a.dni,
      a.direccion,
      a.telefono,
      a.correo,
      a.creado_en,
      e.id AS id_especialidad,
      e.nombre AS especialidad
    FROM administradores a
    LEFT JOIN especialidades e ON a.id_especialidad = e.id
    WHERE a.id = ?
  `, [id]);

  return rows[0];
}

// ==================================================
// ➕ Crear un nuevo administrador
// ==================================================
export async function crearAdministrador(data) {
  const { usuario_id, id_especialidad, nombre, apellido, dni, direccion, telefono, correo } = data;
  const [result] = await db.query(
    `INSERT INTO administradores (usuario_id, id_especialidad, nombre, apellido, dni, direccion, telefono, correo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuario_id, id_especialidad || null, nombre, apellido, dni, direccion, telefono, correo]
  );
  return result.insertId;
}

// ==================================================
// ✏️ Actualizar un administrador
// ==================================================
export async function actualizarAdministrador(id, data) {
  const { id_especialidad, nombre, apellido, dni, direccion, telefono, correo } = data;
  await db.query(
    `UPDATE administradores 
     SET id_especialidad = ?, nombre = ?, apellido = ?, dni = ?, direccion = ?, telefono = ?, correo = ?
     WHERE id = ?`,
    [id_especialidad || null, nombre, apellido, dni, direccion, telefono, correo, id]
  );
}

// ==================================================
// 🗑️ Eliminar un administrador
// ==================================================
export async function eliminarAdministrador(id) {
  await db.query("DELETE FROM administradores WHERE id = ?", [id]);
}
