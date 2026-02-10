import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // Estado para el formulario y mensajes
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // Campo clave detectado en tu script
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Lógica LocalStorage (Tu HTML original) ---
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.some((u) => u.email === formData.email);

    if (exists) {
      setError("Este correo ya está registrado");
      return;
    }

    // --- Simulación de Registro / Preparación API ---
    // Aquí podrías usar el fetch que mostraste en tu script:
    // const response = await fetch("/api/auth/register", { ... })

    const newUser = {
      id: Date.now(),
      ...formData,
      role: "user", // Rol por defecto
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess(true);

    // Redirección tras 1.5 segundos
    setTimeout(() => {
      navigate("/login");
    }, 1500);
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
        <h2 className="text-center fw-bold mb-4">Registro</h2>

        <form onSubmit={handleSubmit}>
          <input
            id="name"
            className="form-control mb-3"
            placeholder="Nombre"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <input
            id="email"
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            id="phone"
            type="text"
            className="form-control mb-3"
            placeholder="Teléfono (WhatsApp)"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            id="password"
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {/* Mensajes de Estado */}
          {error && <div className="text-danger mb-3 text-center">{error}</div>}
          {success && (
            <div className="text-success mb-3 text-center">
              Registro exitoso. Redirigiendo...
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
