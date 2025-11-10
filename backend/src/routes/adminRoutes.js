import express from "express";
import {
  listarAdministradores,
  crear,
  actualizar,
  eliminar
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", listarAdministradores);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
