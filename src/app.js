import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Necesario para __dirname

// Importar rutas (Asegúrate de poner el .js al final)
import authRoutes from "./routes/auth.routes.js";
import materialRoutes from "./routes/material.routes.js";

// Configuración para recrear __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

// Página inicial → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

export default app; // Cambiado de module.exports
