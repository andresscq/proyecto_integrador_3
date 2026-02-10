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
    }, // 👈 Faltaba este campo
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    }, // 👈 Faltaba este campo para la URL de la imagen
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Material = mongoose.model("Material", MaterialSchema);
export default Material;
