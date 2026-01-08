require("dotenv").config(); // 👈 SIEMPRE primero

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto", PORT);
});
