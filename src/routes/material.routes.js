import express from "express";
import auth from "../middleware/auth.js";
import {
  createMaterial,
  getMaterials,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
  getAdminMaterials, // 👈 Asegúrate de importar la nueva función
} from "../controllers/material.controller.js";

const router = express.Router();

// --- RUTAS PÚBLICAS ---
router.get("/", getMaterials); // Solo ve lo aprobado (Catalogo)
router.get("/admin", auth, getAdminMaterials); // 👑 El Admin ve TODO (Pendientes y Aprobados)
router.get("/:id", getMaterialById);

// --- RUTAS PROTEGIDAS ---
router.post("/", auth, createMaterial);
router.delete("/:id", auth, deleteMaterial);
router.put("/:id", auth, updateMaterial); // Para aprobar (approved: true)

export default router;
