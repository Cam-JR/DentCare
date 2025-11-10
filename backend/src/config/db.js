import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'dentcare'
});

try {
  await db.connect();
  console.log('✅ Conectado a la base de datos MySQL');
} catch (error) {
  console.error('❌ Error al conectar con la BD:', error);
}
