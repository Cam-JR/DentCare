import express from "express";
import CitasController from "../controllers/citaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // 🆕 Importar

const router = express.Router();

// 🆕 Agregar verificarToken a todas las rutas
router.get("/", verifyToken, CitasController.getAll);
router.get("/:id", verifyToken, CitasController.getById);
router.post("/", verifyToken, CitasController.create);
router.put("/:id", verifyToken, CitasController.update);
router.delete("/:id", verifyToken, CitasController.delete);

export default router;