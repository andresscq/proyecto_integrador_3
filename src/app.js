const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const materialRoutes = require("./routes/material.routes");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 AQUÍ ESTÁ LA CORRECCIÓN
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

// Página inicial → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

module.exports = app;
