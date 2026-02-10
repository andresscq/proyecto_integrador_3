import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🚀 CONEXIÓN CON TU BACKEND (Asegúrate de que la ruta sea /register en minúsculas si así está en tu router)
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      // ✅ Registro exitoso en PostgreSQL
      setSuccess(true);
      setTimeout(() => {
        navigate("/Login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="register-card p-4 shadow bg-white rounded"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="text-center fw-bold mb-4">Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              id="name"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono (WhatsApp)</label>
            <input
              id="phone"
              type="text"
              className="form-control"
              placeholder="Ej: 593987654321"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="********"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="alert alert-danger p-2 text-center">{error}</div>
          )}
          {success && (
            <div className="alert alert-success p-2 text-center">
              ¡Registrado con éxito! Redirigiendo...
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 mb-3 fw-bold">
            Registrarse
          </button>
        </form>

        <p className="text-center mb-0">
          ¿Ya tienes cuenta? <Link to="/Login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
