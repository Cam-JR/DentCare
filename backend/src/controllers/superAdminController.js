import { User } from '../models/User.js';
import { encryptPassword } from '../utils/crypto.js';

export const createAdmin = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    const existe = await User.findByEmail(correo);
    if (existe) return res.status(400).json({ message: 'El correo ya existe' });

    const hashed = encryptPassword(contrasena);
    const id = await User.create({ nombre, correo, contrasena: hashed, rol: 'admin' });

    res.status(201).json({ message: 'Administrador creado exitosamente', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear administrador' });
  }
};
