import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtenemos el usuario del localStorage (guardado al hacer Login)
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // 🛡️ Protección de ruta: Si no hay usuario, fuera
  useEffect(() => {
    if (!loggedUser || !loggedUser.token) {
      navigate("/Login");
    } else {
      fetchMaterials();
    }
  }, [navigate]);

  // 📥 Obtener materiales reales desde MongoDB
  const fetchMaterials = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/materials");
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener materiales:", error);
      setLoading(false);
    }
  };

  // --- Lógica de Métricas ---
  const metrics = useMemo(() => {
    // Filtrar mis posts comparando el ID del usuario (o email según tu controlador)
    const myPosts = posts.filter(
      (p) => p.user?._id === loggedUser?.id || p.user === loggedUser?.id,
    );

    return {
      myTotal: myPosts.length,
      myRecent: myPosts.slice(0, 3), // Los 3 más nuevos
      globalMaterials: posts.length,
      globalImpact: posts.length * 25, // Ejemplo: 25kg por material
      globalUsers: new Set(posts.map((p) => p.user?._id || p.user)).size,

      chartData: {
        // Ejemplo de lógica para gráfica (puedes ajustar según tus estados)
        total: posts.length,
        mine: myPosts.length,
      },
    };
  }, [posts, loggedUser]);

  // --- Configuración de Gráficas ---
  const doughnutData = {
    labels: ["Mis Aportes", "Otros Usuarios"],
    datasets: [
      {
        data: [metrics.myTotal, metrics.globalMaterials - metrics.myTotal],
        backgroundColor: ["#198754", "#e9ecef"],
      },
    ],
  };

  const barData = {
    labels: ["Impacto Ambiental Total"],
    datasets: [
      {
        label: "Kg Reciclados",
        data: [metrics.globalImpact],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  if (loading)
    return <div className="text-center mt-5">Cargando estadísticas...</div>;

  return (
    <div className="container pb-5 mt-4">
      {/* Bienvenida */}
      <div className="section-box mb-4 p-4 bg-white rounded shadow-sm border-start border-success border-4">
        <h3 className="fw-bold">Dashboard de {loggedUser?.name}</h3>
        <p className="text-muted mb-0">
          Visualiza el impacto de tus materiales reciclados en la comunidad.
        </p>
      </div>

      {/* Estadísticas del usuario */}
      <div className="row mb-4">
        <StatCard
          title="Mis Publicaciones"
          value={metrics.myTotal}
          color="text-primary"
        />
        <StatCard
          title="Comunidad (Total)"
          value={metrics.globalMaterials}
          color="text-success"
        />
        <StatCard
          title="Colaboradores"
          value={metrics.globalUsers}
          color="text-info"
        />
      </div>

      {/* Métricas de impacto */}
      <div className="row mb-4">
        <MetricSmall
          title="Impacto Estimado"
          value={`${metrics.globalImpact} kg`}
          border="border-info"
        />
        <MetricSmall
          title="Puntos Verdes"
          value={metrics.myTotal * 10}
          border="border-warning"
        />
      </div>

      {/* Gráficos */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="bg-white p-4 rounded shadow-sm h-100">
            <h5 className="fw-bold mb-3">Mi Participación</h5>
            <div style={{ height: "250px" }}>
              <Doughnut
                data={doughnutData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="bg-white p-4 rounded shadow-sm h-100">
            <h5 className="fw-bold mb-3">Kilogramos Recuperados</h5>
            <div style={{ height: "250px" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="row g-3 mb-4 text-center">
        <div className="col-md-6">
          <Link
            to="/create-post"
            className="btn btn-success btn-lg w-100 shadow-sm"
          >
            + Publicar Nuevo Material
          </Link>
        </div>
        <div className="col-md-6">
          <Link
            to="/materials"
            className="btn btn-outline-dark btn-lg w-100 shadow-sm"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>

      {/* Últimas publicaciones */}
      <div className="section-box p-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-3">Tus aportes recientes</h4>
        {metrics.myRecent.length > 0 ? (
          metrics.myRecent.map((p) => (
            <div
              key={p._id}
              className="border-bottom py-3 d-flex justify-content-between align-items-center"
            >
              <div>
                <span className="fw-bold d-block">{p.title}</span>
                <small className="text-muted">
                  {p.category} • {p.location}
                </small>
              </div>
              <span className="badge bg-light text-dark">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-muted text-center py-3">
            Aún no has registrado materiales.
          </p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "" }) => (
  <div className="col-md-4 mb-3">
    <div className="card border-0 shadow-sm p-4 text-center h-100">
      <h6 className="text-muted text-uppercase small fw-bold">{title}</h6>
      <h2 className={`fw-bold ${color} mb-0`}>{value}</h2>
    </div>
  </div>
);

const MetricSmall = ({ title, value, border }) => (
  <div className="col-md-6 mb-3">
    <div className={`card ${border} border-start border-4 shadow-sm p-3`}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted">{title}</span>
        <h4 className="fw-bold mb-0">{value}</h4>
      </div>
    </div>
  </div>
);

export default Dashboard;
