import React, { useState, useEffect } from "react";

const Admin = () => {
  const [posts, setPosts] = useState([]);

  // 1. Carga inicial
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  // 2. Cálculos automáticos (Reemplaza a updateStats)
  const total = posts.length;
  const approvedCount = posts.filter((p) => p.approved).length;
  const pendingCount = total - approvedCount;
  const impact = approvedCount * 25;

  // 3. Funciones de acción
  const approvePost = (id) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, approved: true } : p,
    );
    updateAndSave(updated);
  };

  const removePost = (id) => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    const updated = posts.filter((p) => p.id !== id);
    updateAndSave(updated);
  };

  const updateAndSave = (newList) => {
    setPosts(newList);
    localStorage.setItem("posts", JSON.stringify(newList));
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">Panel de administración</h2>

      {/* ESTADÍSTICAS */}
      <div className="row mb-4">
        <StatCard title="Total publicaciones" value={total} type="stat-total" />
        <StatCard title="Aprobadas" value={approvedCount} type="stat-ok" />
        <StatCard title="Pendientes" value={pendingCount} type="stat-pending" />
        <StatCard
          title="Impacto ambiental"
          value={`${impact} kg`}
          type="stat-impact"
        />
      </div>

      {/* TABLA */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-bordered align-middle bg-white">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Tipo</th>
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
                  No hay publicaciones registradas
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.type}</td>
                  <td>${p.price}</td>
                  <td>{p.user}</td>
                  <td>
                    {p.approved ? (
                      <span className="badge bg-success">Aprobada</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="table-actions">
                    {!p.approved && (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => approvePost(p.id)}
                      >
                        Aprobar
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removePost(p.id)}
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

// Sub-componente para las cartas de stats (para no repetir código)
const StatCard = ({ title, value, type }) => (
  <div className="col-md-3 mb-3">
    <div className={`card stat-card ${type} shadow-sm`}>
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h3 className="fw-bold mb-0">{value}</h3>
      </div>
    </div>
  </div>
);

export default Admin;
