import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }, // 📱 Asegúrate de que esté este campo
  role: { type: String, default: "user" },
});

// Cambiamos module.exports por export default
const User = mongoose.model("User", UserSchema);
export default User;
