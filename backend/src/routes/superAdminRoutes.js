import express from "express";
import { createAdmin } from "../controllers/superAdminController.js";
import { getPacientes, updatePaciente, deletePaciente } from "../controllers/pacienteController.js";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Solo el superadmin puede crear otros admins 
router.post('/crear-admin', verifyToken, isSuperAdmin, createAdmin);

// ✅ Rutas protegidas para gestión de pacientes (solo superadmin)
router.get("/pacientes", verifyToken, isSuperAdmin, getPacientes);
router.put("/pacientes/:id", verifyToken, isSuperAdmin, updatePaciente);
router.delete("/pacientes/:id", verifyToken, isSuperAdmin, deletePaciente);


export default router;
