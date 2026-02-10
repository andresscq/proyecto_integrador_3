import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  // Obtenemos los datos del usuario y los posts
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Filtramos los posts del usuario actual
  const myPosts = posts.filter((p) => p.user === user?.email);

  // Calculamos los datos de actividad
  const totalPosts = myPosts.length;
  const lastPostTitle = totalPosts > 0 ? myPosts[totalPosts - 1].title : "—";
  const accountSince = user?.id ? new Date(user.id).toLocaleDateString() : "—";

  return (
    <div className="container my-4">
      {/* Información del Perfil */}
      <div className="profile-card p-4 mb-4 bg-white rounded shadow-sm">
        <h3 className="fw-bold mb-3">Perfil de usuario</h3>
        <p>
          <strong>Nombre:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Rol:</strong>{" "}
          {user?.role === "admin" ? "Administrador" : "Usuario"}
        </p>
      </div>

      {/* Estadísticas de Actividad */}
      <div className="profile-card p-4 mb-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-3">Actividad</h4>
        <div className="row text-center">
          <div className="col-md-4">
            <h5 className="fw-bold">{totalPosts}</h5>
            <p className="text-muted">Publicaciones creadas</p>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold">{lastPostTitle}</h5>
            <p className="text-muted">Última publicación</p>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold">{accountSince}</h5>
            <p className="text-muted">Cuenta creada</p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="profile-card p-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-3">Acciones</h4>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/create-post" className="btn btn-primary">
            + Publicar material
          </Link>
          <Link to="/materials" className="btn btn-outline-secondary">
            Ver materiales
          </Link>
          <Link to="/dashboard" className="btn btn-outline-secondary">
            Ir al dashboard
          </Link>

          {/* Renderizado condicional para el botón de Admin */}
          {user?.role === "admin" && (
            <Link to="/admin" className="btn btn-outline-danger">
              Panel de administración
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
