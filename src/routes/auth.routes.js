import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { query } from "../config/postgres.js"; // Importamos la conexión de Postgres

const router = express.Router();

// 📝 Rutas de Usuario
router.post("/register", register);
router.post("/login", login);

// 🔍 Ruta de Auditoría (Para conectar y ver los datos de Postgres)
router.get("/logs", async (req, res) => {
  try {
    const result = await query(
      `SELECT admin_logs.*, users.name as admin_name 
       FROM admin_logs 
       JOIN users ON admin_logs.admin_id = users.id 
       ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener datos de Postgres",
      error: error.message,
    });
  }
});

export default router;
