import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js'; 
import dashboardRoutes from "./routes/dashboardRoutes.js"; 



const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes); 
app.use("/api/dashboard", dashboardRoutes);

export default app;



