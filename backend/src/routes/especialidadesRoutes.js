// routes/especialidadesRoutes.js
import express from "express";
import { obtenerEspecialidades } from "../models/Especialidad.js";

const router = express.Router();

// ✅ Obtener todas las especialidades
router.get("/", async (req, res) => {
  try {
    const especialidades = await obtenerEspecialidades();
    res.json(especialidades);
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    res.status(500).json({ error: "Error al obtener especialidades" });
  }
});

export default router;
