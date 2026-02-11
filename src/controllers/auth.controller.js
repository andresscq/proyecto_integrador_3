import { query } from "../config/postgres.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🚀 CAMBIO: Llamamos al procedimiento almacenado que creaste en Postgres
    // Pasamos los 4 parámetros que definimos en el SP
    await query("CALL sp_registrar_usuario($1, $2, $3, $4)", [
      name,
      email,
      hashedPassword,
      phone,
    ]);

    // Como el SP no devuelve el registro, enviamos una confirmación limpia
    res.json({
      message: "Usuario registrado con éxito mediante Procedimiento Almacenado",
      user: { name, email },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar con el procedimiento en Postgres",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos en Postgres (El login se mantiene con SELECT para validar datos)
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no existe en Postgres" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone, // Este es el que ahora viaja correctamente al catálogo
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el login", error: error.message });
  }
};
