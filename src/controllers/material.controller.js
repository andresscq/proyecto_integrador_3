const Material = require("../models/Material");

// 📝 Crear material (asociado al usuario)
exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      user: req.userId, // 👈 ID del usuario autenticado
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear material" });
  }
};

// 📥 Obtener todos los materiales (para todos los usuarios)
exports.getMaterials = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const materials = await Material.find(filter)
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener materiales" });
  }
};

// 🔍 Obtener material por ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "user",
      "name phone"
    );

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener material" });
  }
};

// 🗑 Eliminar material (SOLO el dueño)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    // 🔐 Validar que el material sea del usuario
    if (material.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No puedes eliminar este material" });
    }

    await material.deleteOne();

    res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar material" });
  }
};
