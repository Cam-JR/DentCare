// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import especialidadesRoutes from './routes/especialidadesRoutes.js';
import citaRoutes from './routes/citaRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/superadmin/administradores', adminRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/citas', citaRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.send('✅ DentCare Backend funcionando');
});

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
