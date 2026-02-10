import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const logout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        {/* Usamos NavLink a "/" para volver al Inicio */}
        <NavLink className="navbar-brand fw-bold" to="/">
          ReConstruye
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                {/* Enlaces para usuarios logueados */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Materials">
                    Materiales
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-3">
                  <button onClick={logout} className="btn btn-sm btn-danger">
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Enlaces para visitantes (Inicio y Registro) */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/Login">
                    Iniciar Sesión
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink className="btn btn-success btn-sm" to="/Register">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
