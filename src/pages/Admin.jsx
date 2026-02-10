import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // 🛡️ 1. Protección y Carga inicial desde MongoDB
  useEffect(() => {
    if (!loggedUser || loggedUser.email !== "admin@reconstruye.com") {
      alert("Acceso denegado. Se requieren permisos de administrador.");
      navigate("/Login");
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/materials");
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
      setLoading(false);
    }
  };

  // 2. Cálculos automáticos basados en la data de MongoDB
  const total = posts.length;
  const approvedCount = posts.filter((p) => p.approved).length;
  const pendingCount = total - approvedCount;
  const impact = approvedCount * 25;

  // 3. Funciones de acción conectadas al Backend
  const approvePost = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/materials/${id}`,
        {
          method: "PUT", // 👈 Debe coincidir con router.put
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
          },
          body: JSON.stringify({ approved: true }),
        },
      );

      if (response.ok) {
        alert("Material aprobado con éxito");
        fetchPosts(); // Esta función debe recargar tu lista de posts
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
    }
  };

  const removePost = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar permanentemente este material de la base de datos?",
      )
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/materials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        },
      );

      if (response.ok) {
        fetchPosts(); // Recargar lista desde la DB
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading)
    return <div className="text-center mt-5">Cargando panel de control...</div>;

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Panel de Administración (Base de Datos)</h2>

      {/* ESTADÍSTICAS */}
      <div className="row mb-4">
        <StatCard
          title="Total publicaciones"
          value={total}
          type="bg-dark text-white"
        />
        <StatCard
          title="Aprobadas"
          value={approvedCount}
          type="bg-success text-white"
        />
        <StatCard title="Pendientes" value={pendingCount} type="bg-warning" />
        <StatCard
          title="Impacto ambiental"
          value={`${impact} kg`}
          type="bg-info text-white"
        />
      </div>

      {/* TABLA */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle bg-white mb-0">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No hay publicaciones en MongoDB
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p._id}>
                  <td className="fw-bold">{p.title}</td>
                  <td>{p.category || p.type}</td>
                  <td>${p.price}</td>
                  <td>{p.user?.name || "Desconocido"}</td>
                  <td>
                    {p.approved ? (
                      <span className="badge bg-success">Aprobada</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td>
                    {!p.approved && (
                      <button
                        className="btn btn-outline-success btn-sm me-2"
                        onClick={() => approvePost(p._id)}
                      >
                        Aprobar
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removePost(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, type }) => (
  <div className="col-md-3 mb-3">
    <div className={`card ${type} border-0 shadow-sm`}>
      <div className="card-body">
        <h6 className={type.includes("white") ? "text-white-50" : "text-muted"}>
          {title}
        </h6>
        <h3 className="fw-bold mb-0">{value}</h3>
      </div>
    </div>
  </div>
);

export default Admin;
