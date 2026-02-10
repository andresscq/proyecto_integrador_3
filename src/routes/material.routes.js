import express from "express";
import auth from "../middleware/auth.js";
import {
  createMaterial,
  getMaterials,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
} from "../controllers/material.controller.js";

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", auth, createMaterial);
router.delete("/:id", auth, deleteMaterial); // DELETE para eliminar
router.put("/:id", auth, updateMaterial); // PUT para aprobar

export default router;
