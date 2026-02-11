import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // 🛡️ 1. Protección de Ruta y Carga Inicial
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
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/materials/admin",
        {
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Error al obtener datos");

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error al cargar:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Estadísticas
  const total = posts.length;
  const approvedCount = posts.filter((p) => p.approved).length;
  const pendingCount = total - approvedCount;
  const impact = approvedCount * 25;

  // 3. Acciones (Aprobar y Eliminar)
  const approvePost = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/materials/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
          },
          body: JSON.stringify({ approved: true }),
        },
      );

      // ✅ Verificamos response.ok y procesamos el JSON para evitar el error falso
      if (response.ok) {
        await response.json();
        alert("¡Material aprobado con éxito!");
        fetchPosts(); // 🔄 Recarga automática de la lista
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error: ${errorData.message || "No se pudo aprobar"}`);
      }
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("Fallo de conexión al aprobar.");
    }
  };

  const removePost = async (id) => {
    if (!window.confirm("¿Eliminar permanentemente este material?")) return;

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
        alert("Eliminado correctamente");
        fetchPosts();
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

  return (
    <div className="container my-4 pb-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Panel de Control</h2>
          <p className="text-muted">Gestión PostgreSQL + MongoDB</p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchPosts}
        >
          🔄 Actualizar
        </button>
      </header>

      {/* ESTADÍSTICAS */}
      <div className="row mb-4">
        <StatCard title="Total" value={total} type="bg-dark text-white" />
        <StatCard
          title="Aprobadas"
          value={approvedCount}
          type="bg-success text-white"
        />
        <StatCard
          title="Pendientes"
          value={pendingCount}
          type="bg-warning text-dark"
        />
        <StatCard
          title="Impacto (CO2)"
          value={`${impact} kg`}
          type="bg-primary text-white"
        />
      </div>

      {/* TABLA */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Material</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Vendedor</th>
                <th>Estado</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No hay materiales.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img
                          src={p.image}
                          alt=""
                          className="rounded me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <span className="fw-bold">{p.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {p.category}
                      </span>
                    </td>
                    <td>${p.price}</td>
                    <td>
                      <div className="small">
                        <div className="fw-bold">{p.userName || "Admin"}</div>
                        <div className="text-muted small">
                          {p.userPhone || "Sin teléfono"}
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.approved ? (
                        <span className="badge rounded-pill bg-success-subtle text-success border border-success">
                          Aprobado
                        </span>
                      ) : (
                        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      {!p.approved && (
                        <button
                          className="btn btn-success btn-sm me-2 shadow-sm"
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
    </div>
  );
};

const StatCard = ({ title, value, type }) => (
  <div className="col-md-3 mb-3">
    <div className={`card ${type} border-0 shadow-sm h-100`}>
      <div className="card-body d-flex flex-column justify-content-center">
        <h6 className="opacity-75 small text-uppercase fw-bold">{title}</h6>
        <h3 className="fw-bold mb-0">{value}</h3>
      </div>
    </div>
  </div>
);

export default Admin;
