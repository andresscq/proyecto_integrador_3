import User from "../models/User.js"; // IMPORTANTE: Agregamos .js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Cambiamos exports.Register por export const register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.json({
      message: "Usuario registrado",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Cambiamos exports.Login por export const login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      id: user._id,
      name: user.name,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el login", error: error.message });
  }
};
