// En config/postgres.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 👈 AGREGA ESTO PARA PROBAR LA CONEXIÓN
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.stack);
  } else {
    console.log("✅ PostgreSQL Conectado: ", res.rows[0].now);
  }
});

export const query = (text, params) => pool.query(text, params);
