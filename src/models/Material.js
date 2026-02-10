import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Quito, Ecuador",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    // --- CAMBIOS PARA POSTGRES ---
    user: {
      type: Number, // 👈 Ahora es Number porque el ID de Postgres es SERIAL (1, 2, 3...)
      required: true,
    },
    userName: {
      type: String, // 👈 Guardamos el nombre del vendedor aquí
      required: true,
    },
    userPhone: {
      type: String, // 👈 Guardamos el teléfono para WhatsApp aquí
      required: true,
    },
    // ----------------------------
  },
  { timestamps: true },
);

const Material = mongoose.model("Material", MaterialSchema);
export default Material;
