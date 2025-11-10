import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Paciente } from '../models/Paciente.js';
import { encryptPassword, decryptPassword } from '../utils/crypto.js';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, correo, contrasena, rol } = req.body;

    // Verificar si el correo ya existe
    const userExists = await User.findByEmail(correo);
    if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });

    // Encriptar la contraseña
    const hashed = encryptPassword(contrasena);

    // Crear usuario base
    const newUserId = await User.create({
      nombre,
      correo,
      contrasena: hashed,
      rol: rol || 'paciente'
    });

    // Si el rol es "paciente", creamos también el registro en la tabla pacientes
    if (rol === 'paciente' || !rol) {
      await Paciente.create({
        id_usuario: newUserId,
        nombre,
        apellido,
        dni,
        telefono,
        correo
      });
    }

    res.status(201).json({ message: 'Usuario creado exitosamente', userId: newUserId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const user = await User.findByEmail(correo);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const decrypted = decryptPassword(user.contrasena);
    if (decrypted !== contrasena) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      rol: user.rol
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
