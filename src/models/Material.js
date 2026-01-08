const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  title: String,
  category: String,
  location: String,
  description: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Material", MaterialSchema);
