import { db } from "../config/db.js";

export async function obtenerEspecialidades() {
  const [rows] = await db.query("SELECT id, nombre FROM especialidades ORDER BY nombre ASC");
  return rows;
}
