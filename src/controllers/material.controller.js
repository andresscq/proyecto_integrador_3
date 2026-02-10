import Material from "../models/Material.js";
import { query } from "../config/postgres.js";

// 📝 Crear material (Híbrido: Datos en Mongo, ID de usuario de Postgres)
export const createMaterial = async (req, res) => {
  try {
    const { title, category, price, description, image, userName, userPhone } =
      req.body;

    const material = await Material.create({
      title,
      category,
      price,
      description,
      image,
      userName, // Datos desnormalizados para evitar consultas lentas a Postgres
      userPhone,
      user: req.userId, // ID numérico que viene del Token (Postgres)
      approved: false,
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al crear material en MongoDB" });
  }
};

// 📥 Obtener todos los materiales aprobados
export const getMaterials = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = { approved: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener materiales de MongoDB" });
  }
};

// 🔍 Obtener un solo material por ID (Esta es la que te daba el Error)
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res
        .status(404)
        .json({ message: "Material no encontrado en MongoDB" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "ID de material no válido" });
  }
};

// 🚀 APROBAR MATERIAL (Actualiza Mongo y REGISTRA en Postgres)
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    // 1. Actualizar en MongoDB
    const updated = await Material.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "No encontrado" });

    // 2. AUDITORÍA: Si se aprueba, guardamos quién lo hizo en PostgreSQL
    if (approved === true) {
      await query(
        "INSERT INTO admin_logs (admin_id, accion, material_id) VALUES ($1, $2, $3)",
        [req.userId, "APROBACIÓN", id],
      );
    }

    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en la operación híbrida (Mongo/Postgres)" });
  }
};

// 🗑 ELIMINAR (Registra la eliminación en Postgres)
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const materialEliminado = await Material.findByIdAndDelete(id);

    if (!materialEliminado)
      return res.status(404).json({ message: "Material no existe" });

    // Registro de seguridad en Postgres
    await query(
      "INSERT INTO admin_logs (admin_id, accion, material_id) VALUES ($1, $2, $3)",
      [req.userId, "ELIMINACIÓN", id],
    );

    res.json({ message: "Material eliminado y registrado en Postgres" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
