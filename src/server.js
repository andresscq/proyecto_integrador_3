import "dotenv/config"; // Carga automáticamente el archivo .env
import connectDB from "./config/db.js"; // IMPORTANTE: Agregué el .js
import app from "./App.js"; // IMPORTANTE: Agregué el .js

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto", PORT);
});
