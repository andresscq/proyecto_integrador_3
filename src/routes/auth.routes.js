import express from "express";
// IMPORTANTE: Agregamos la extensión .js al final de la ruta
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/Register", register);
router.post("/Login", login);

export default router; // Cambiado de module.exports a export default
