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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Verificación de seguridad
    if (!loggedUser || !loggedUser.token) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      navigate("/Login");
      return;
    }

    setLoading(true);

    // 📝 Estructura de datos para MongoDB
    const materialData = {
      title: formData.title.trim(),
      category: formData.type.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim() || "https://via.placeholder.com/300",
      location: "Quito, Ecuador",
      // 🔒 IMPORTANTE: Forzamos que el material nazca desactivado
      approved: false,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al publicar el material");
      }

      alert(
        "¡Material enviado! Estará visible una vez que el administrador lo apruebe.",
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

      <div className="form-box shadow-sm p-4 rounded bg-white border border-top-0">
        <div className="alert alert-info border-0 small">
          Nota: Tu publicación no aparecerá en el catálogo general hasta que un
          administrador verifique los datos.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Título del material
            </label>
            <input
              className="form-control"
              id="title"
              placeholder="Ej: 50 Ladrillos de arcilla"
              required
              value={formData.title}
              onChange={handleChange}
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
              <option value="">Selecciona un tipo</option>
              <optgroup label="Cemento">
                <option>Cemento</option>
                <option>Cemento Portland</option>
                <option>Cemento Blanco</option>
              </optgroup>
              <optgroup label="Madera">
                <option>Madera reciclada</option>
                <option>Triplay</option>
                <option>Tablones</option>
              </optgroup>
              <option>Metal</option>
              <option>Ladrillo</option>
              <option>Vidrio</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Precio estimado (USD)
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              placeholder="0.00"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small text-uppercase">
              Descripción detallada
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              placeholder="Estado del material, dimensiones, cantidad exacta..."
              required
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-uppercase">
              URL de la Imagen (Link)
            </label>
            <input
              className="form-control"
              id="image"
              placeholder="https://images.com/foto-material.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : (
              "Enviar para Revisión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
