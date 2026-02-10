import Material from "../models/Material.js";

// 📝 Crear material (Nace como pendiente)
export const createMaterial = async (req, res) => {
  try {
    const material = await Material.create({
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image, // 👈 Este debe recibir la URL del Frontend
      user: req.userId,
      approved: false,
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al crear" });
  }
};

// 📥 Obtener todos los materiales
export const getMaterials = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const materials = await Material.find(filter)
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener materiales" });
  }
};

// 🚀 APROBAR MATERIAL (La función que activa el botón)
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // Usamos $set para asegurarnos de que solo cambie el campo enviado
    const updated = await Material.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true },
    );

    if (!updated)
      return res.status(404).json({ message: "Material no encontrado" });

    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar en la base de datos" });
  }
};

// 🗑 ELIMINAR (Permite al dueño y al Admin)
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);

    if (!material) return res.status(404).json({ message: "No encontrado" });

    // Si el usuario es el Admin (puedes verificar por correo si lo tienes en req)
    // O simplemente permites el delete si el token es válido (confiando en el panel admin)
    await Material.findByIdAndDelete(id);

    res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "user",
      "name phone",
    );
    if (!material) return res.status(404).json({ message: "No encontrado" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener material" });
  }
};
