import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  // 1. Definimos el estado para el formulario y errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate(); // Para redireccionar sin recargar

  // ADMIN GLOBAL (Podrías mover esto a un archivo de constantes)
  const ADMIN_EMAIL = "admin@reconstruye.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(false);

    // Lógica del Admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: 0,
          name: "Administrador",
          email: ADMIN_EMAIL,
          role: "admin",
        }),
      );
      navigate("/Admin"); // Redirección estilo React
      return;
    }

    // Lógica de Usuario Normal
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      setShowError(true);
      return;
    }

    localStorage.setItem(
      "loggedUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      }),
    );

    navigate("/Dashboard");
  };

  return (
    <div className="login-container">
      {" "}
      {/* Los estilos irían en tu CSS */}
      <div className="login-card">
        <h2 className="text-center fw-bold mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showError && (
            <div className="text-danger mb-3">Credenciales incorrectas</div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Entrar
          </button>
        </form>

        <p className="text-center mb-0">
          ¿No tienes cuenta? <Link to="/Register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
