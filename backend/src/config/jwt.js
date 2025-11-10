// backend/src/config/jwt.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "clave_secreta_dentcare"; // 🔒 Cambia esto por una variable .env

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
