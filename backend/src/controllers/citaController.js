import Cita from "../models/Cita.js";

const CitasController = {
  getAll: async (req, res) => {
    try {
      const citas = await Cita.getAll();
      res.json(citas);
    } catch (err) {
      console.error("Error en getAll:", err);
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const cita = await Cita.getById(req.params.id);
      if (!cita) return res.status(404).json({ error: "Cita no encontrada" });
      res.json(cita);
    } catch (err) {
      console.error("Error en getById:", err);
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { 
        id_paciente, 
        fecha_cita, 
        id_admin = null, 
        id_especialidad = null, 
        estado = "pendiente", 
        observaciones = null 
      } = req.body;

      if (!id_paciente || !fecha_cita) {
        return res.status(400).json({ error: "id_paciente y fecha_cita son requeridos" });
      }

      const nuevaCita = await Cita.create({ 
        id_paciente, 
        fecha_cita, 
        id_admin, 
        id_especialidad, 
        estado, 
        observaciones 
      });
      
      res.status(201).json({ 
        message: "Cita creada correctamente",
        data: nuevaCita 
      });
    } catch (err) {
      console.error("Error en create:", err);
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { 
        fecha_cita, 
        id_admin, 
        id_especialidad, 
        estado, 
        observaciones 
      } = req.body;

      console.log("📝 Datos recibidos para actualizar:", req.body); // 🆕 Debug

      if (!fecha_cita) {
        return res.status(400).json({ error: "fecha_cita es requerida" });
      }

      // 🆕 Construir objeto solo con campos definidos
      const datosActualizar = {
        fecha_cita,
        estado,
        observaciones: observaciones || null,
      };

      // Solo agregar si tienen valor
      if (id_admin !== undefined && id_admin !== null && id_admin !== "") {
        datosActualizar.id_admin = id_admin;
      } else {
        datosActualizar.id_admin = null;
      }

      if (id_especialidad !== undefined && id_especialidad !== null && id_especialidad !== "") {
        datosActualizar.id_especialidad = id_especialidad;
      } else {
        datosActualizar.id_especialidad = null;
      }

      console.log("✅ Datos a actualizar:", datosActualizar); // 🆕 Debug

      const actualizada = await Cita.update(req.params.id, datosActualizar);
      
      res.json({ 
        message: "Cita actualizada correctamente", 
        data: actualizada 
      });
    } catch (err) {
      console.error("❌ Error en update:", err);
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Cita.delete(req.params.id);
      res.json({ message: "Cita eliminada correctamente" });
    } catch (err) {
      console.error("Error en delete:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

export default CitasController;