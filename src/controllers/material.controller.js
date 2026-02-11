import Material from "../models/Material.js";
import { query } from "../config/postgres.js";

// 📝 CREAR MATERIAL
export const createMaterial = async (req, res) => {
  try {
    const { title, category, price, description, image, userName, userPhone } =
      req.body;
    const material = await Material.create({
      title,
      category,
      price: Number(price),
      description,
      image,
      userName,
      userPhone,
      user: req.userId,
      approved: false,
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al crear", error: error.message });
  }
};

// 👑 ADMIN: Obtener todos (Aprobados y Pendientes)
export const getAdminMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener lista de admin" });
  }
};

// 🚀 APROBAR MATERIAL
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    // 1. Actualizar en MongoDB
    // Usamos returnDocument: "after" para evitar el warning de 'new: true'
    const updated = await Material.findByIdAndUpdate(
      id,
      { $set: { approved } },
      { returnDocument: "after" },
    );

    if (!updated) return res.status(404).json({ message: "No encontrado" });

    // 2. AUDITORÍA: Si se aprueba, guardamos en PostgreSQL
    if (approved === true) {
      try {
        // ✅ CAMBIADO: 'accion' por 'action' para que coincida con tu tabla en PG
        await query(
          "INSERT INTO admin_logs (admin_id, action, material_id) VALUES ($1, $2, $3)",
          [req.userId, "APROBACIÓN", id],
        );
      } catch (pgError) {
        // Logueamos el error de Postgres pero permitimos que la respuesta siga
        console.error("Error en log de Postgres (action):", pgError.message);
      }
    }

    // 3. Respuesta exitosa para React
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error general en updateMaterial:", error);
    return res.status(500).json({ message: "Error al actualizar" });
  }
};

// 🗑 ELIMINAR
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const materialEliminado = await Material.findByIdAndDelete(id);

    if (!materialEliminado)
      return res.status(404).json({ message: "No existe" });

    await query(
      "INSERT INTO admin_logs (admin_id, accion, material_id) VALUES ($1, $2, $3)",
      [req.userId, "ELIMINACIÓN", id],
    );

    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};

// 📥 PÚBLICO: Solo aprobados
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ approved: true }).sort({
      createdAt: -1,
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    res.json(material);
  } catch (error) {
    res.status(404).json({ message: "No encontrado" });
  }
};
