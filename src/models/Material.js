import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, default: "https://via.placeholder.com/300" },
    description: { type: String, required: true },
    location: { type: String, default: "Quito, Ecuador" },
    approved: { type: Boolean, default: false },

    // 🚀 AGREGAMOS ESTOS CAMPOS PARA WHATSAPP
    userName: { type: String },
    userPhone: { type: String },

    // Mantenemos la referencia al ID de Postgres por si acaso
    user: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Material = mongoose.model("Material", MaterialSchema);
export default Material;
