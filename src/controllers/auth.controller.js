import { query } from "../config/postgres.js"; // 👈 Ahora importamos Postgres
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos en la tabla de Postgres
    const result = await query(
      "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email",
      [name, email, hashedPassword, phone],
    );

    res.json({
      message: "Usuario registrado en PostgreSQL",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar en Postgres",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos en Postgres
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no existe en Postgres" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // El ID ahora viene de Postgres (es un número)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el login", error: error.message });
  }
};
