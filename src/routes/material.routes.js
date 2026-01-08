const express = require("express");
const auth = require("../middleware/auth");
const {
  createMaterial,
  getMaterials,
  deleteMaterial,
} = require("../controllers/material.controller");

const router = express.Router();

router.post("/", auth, createMaterial);
router.get("/", getMaterials);
router.delete("/:id", auth, deleteMaterial); // 👈 eliminar

module.exports = router;
