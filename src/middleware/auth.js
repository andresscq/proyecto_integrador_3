import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Guardamos el ID para usarlo en el controlador
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

export default auth; // Cambiado de module.exports
