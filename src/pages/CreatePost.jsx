import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión");
      navigate("/login");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      image: formData.image.trim() || "https://via.placeholder.com/300",
      user: user.email,
      approved: false, // Se envía para revisión como en tu JS original
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Post enviado para revisión");
    navigate("/dashboard");
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Publicar material</h2>

      <div className="form-box shadow p-4 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            id="title"
            placeholder="Título del material"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <select
            className="form-control mb-3"
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
              <option>Madera</option>
              <option>Madera reciclada</option>
              <option>Triplay</option>
              <option>Tablones</option>
            </optgroup>
            {/* ... Agrega el resto de tus opciones aquí ... */}
            <option>Metal</option>
            <option>Ladrillo</option>
            <option>Vidrio</option>
          </select>

          <input
            type="number"
            className="form-control mb-3"
            id="price"
            placeholder="Precio en USD"
            required
            value={formData.price}
            onChange={handleChange}
          />

          <textarea
            className="form-control mb-3"
            id="description"
            rows="4"
            placeholder="Descripción del material"
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <input
            className="form-control mb-3"
            id="image"
            placeholder="URL de la imagen (opcional)"
            value={formData.image}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-success w-100 fw-bold">
            Publicar material
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
