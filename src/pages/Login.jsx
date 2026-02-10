import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🚀 Conexión con PostgreSQL a través del Backend
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // 🛡️ DEFINIR ROL (Mantenemos tu lógica de Admin)
      const isAdmin = email === "admin@reconstruye.com";
      const userRole = isAdmin ? "admin" : "user";

      // ✅ GUARDAR EN LOCALSTORAGE
      // Ahora incluimos 'phone' porque Postgres lo devuelve y lo usaremos para WhatsApp
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          token: data.token,
          id: data.id, // En Postgres siempre será 'id' (numérico)
          name: data.name,
          email: email,
          phone: data.phone, // 👈 Importante para el catálogo
          role: userRole,
        }),
      );

      // 🧭 REDIRECCIÓN
      if (isAdmin) {
        navigate("/Admin");
      } else {
        navigate("/Dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="login-container d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="login-card p-4 shadow bg-white rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center fw-bold mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div
              className="alert alert-danger p-2 text-center"
              style={{ fontSize: "0.9rem" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3 fw-bold py-2"
          >
            Entrar al Sistema
          </button>
        </form>

        <p className="text-center mb-0 mt-2">
          ¿No tienes cuenta?{" "}
          <Link to="/Register" className="text-decoration-none fw-bold">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
