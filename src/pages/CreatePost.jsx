import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 🛠️ Función para asegurar que el teléfono sea válido para WhatsApp
  const formatPhoneForWA = (phone) => {
    if (!phone) return "";
    let cleaned = phone.toString().replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    if (!cleaned.startsWith("593")) {
      cleaned = "593" + cleaned;
    }

    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedUser || !loggedUser.token) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      navigate("/Login");
      return;
    }

    // 🚨 VALIDACIÓN CRÍTICA: Si el usuario no tiene teléfono en el localStorage
    if (!loggedUser.telefono) {
      alert(
        "Error: No tienes un número de teléfono registrado. Por favor, actualiza tu perfil o regístrate de nuevo.",
      );
      return;
    }

    setLoading(true);

    const materialData = {
      title: formData.title.trim(),
      category: formData.type.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim() || "https://via.placeholder.com/300",
      approved: false,
      userName: loggedUser.nombre,
      // ✅ CORRECCIÓN AQUÍ: Usamos la función formatPhoneForWA
      userPhone: formatPhoneForWA(loggedUser.telefono),
    };

    try {
      const response = await fetch("http://localhost:3000/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al publicar");
      }

      alert(
        "¡Material enviado! Estará visible cuando el administrador lo apruebe.",
      );
      navigate("/Dashboard");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success mb-0">Publicar Material</h2>
        <span className="badge bg-warning text-dark p-2">
          Sujeto a revisión
        </span>
      </div>

      <div className="form-box shadow-sm p-4 rounded bg-white border">
        <div className="alert alert-info border-0 small py-2">
          Publicarás como: <strong>{loggedUser?.nombre}</strong> <br />
          Tu número de contacto: <strong>{loggedUser?.telefono}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ... resto del formulario igual ... */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Título
            </label>
            <input
              className="form-control"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Vigas de acero"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Categoría
            </label>
            <select
              className="form-select"
              id="type"
              required
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option>Cemento</option>
              <option>Madera</option>
              <option>Metal</option>
              <option>Ladrillo</option>
              <option>Vidrio</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Precio (USD)
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              required
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-uppercase">
              URL Imagen
            </label>
            <input
              className="form-control"
              id="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Enviar para Revisión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
