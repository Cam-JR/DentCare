import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js'; 
import dashboardRoutes from "./routes/dashboardRoutes.js"; 
import adminRoutes from "./routes/adminRoutes.js";
import especialidadesRoutes from "./routes/especialidadesRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes); 
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/superadmin/administradores", adminRoutes);
app.use("/api/especialidades", especialidadesRoutes);


app.listen(process.env.PORT || 4000, () => {
  console.log("✅ Servidor corriendo en el puerto 4000");
});

export default app; 
 
