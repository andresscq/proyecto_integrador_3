import React, { useMemo } from "react";
import { Link } from "react-router-dom";
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

// Registramos los componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // --- Lógica de Datos (useMemo para optimizar rendimiento) ---
  const metrics = useMemo(() => {
    const myPosts = posts.filter((p) => p.user === user?.email);
    const approvedGlobal = posts.filter((p) => p.approved);

    return {
      myTotal: myPosts.length,
      myPending: myPosts.filter((p) => !p.approved).length,
      myApproved: myPosts.filter((p) => p.approved).length,
      myRecent: myPosts.slice(-3).reverse(),

      globalMaterials: approvedGlobal.length,
      globalUsers: new Set(approvedGlobal.map((p) => p.user)).size,
      globalImpact: approvedGlobal.length * 25,
      globalValue: approvedGlobal.reduce(
        (sum, p) => sum + Number(p.price || 0),
        0,
      ),

      chartData: {
        approved: posts.filter((p) => p.approved).length,
        pending: posts.filter((p) => !p.approved).length,
      },
    };
  }, [posts, user]);

  // --- Configuración de Gráficas ---
  const doughnutData = {
    labels: ["Aprobadas", "En revisión"],
    datasets: [
      {
        data: [metrics.chartData.approved, metrics.chartData.pending],
        backgroundColor: ["#198754", "#ffc107"],
      },
    ],
  };

  const barData = {
    labels: ["Impacto ambiental"],
    datasets: [
      {
        label: "Kg reciclados",
        data: [metrics.globalImpact],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  return (
    <div className="container pb-5">
      {/* Bienvenida */}
      <div className="section-box mb-4 p-4 bg-white rounded shadow-sm">
        <h3 className="fw-bold">Dashboard Personal</h3>
        <p className="text-muted mb-0">
          Hola, <strong>{user?.name}</strong>. Gestiona tus publicaciones y
          visualiza el impacto ambiental.
        </p>
      </div>

      {/* Estadísticas del usuario */}
      <div className="row mb-4">
        <StatCard title="Publicaciones creadas" value={metrics.myTotal} />
        <StatCard
          title="En revisión"
          value={metrics.myPending}
          color="text-warning"
        />
        <StatCard
          title="Aprobadas"
          value={metrics.myApproved}
          color="text-success"
        />
      </div>

      {/* Métricas globales */}
      <div className="row mb-4">
        <MetricSmall
          title="Materiales"
          value={metrics.globalMaterials}
          border="border-success"
        />
        <MetricSmall
          title="Usuarios"
          value={metrics.globalUsers}
          border="border-primary"
        />
        <MetricSmall
          title="Impacto"
          value={`${metrics.globalImpact} kg`}
          border="border-info"
        />
        <MetricSmall
          title="Valor"
          value={`$${metrics.globalValue}`}
          border="border-warning"
        />
      </div>

      {/* Gráficos */}
      <div className="section-box mb-4 p-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-4">Impacto del proyecto</h4>
        <div className="row">
          <div className="col-md-6 mb-4" style={{ maxHeight: "300px" }}>
            <Doughnut
              data={doughnutData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
          <div className="col-md-6 mb-4" style={{ maxHeight: "300px" }}>
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="section-box mb-4 p-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-3">Acciones rápidas</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <Link to="/create-post" className="btn btn-primary w-100">
              + Crear publicación
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/materials" className="btn btn-outline-secondary w-100">
              Ver materiales
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/profile" className="btn btn-outline-secondary w-100">
              Editar perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Últimas publicaciones */}
      <div className="section-box p-4 bg-white rounded shadow-sm">
        <h4 className="fw-bold mb-3">Tus últimas publicaciones</h4>
        {metrics.myRecent.length > 0 ? (
          metrics.myRecent.map((p) => (
            <div key={p.id} className="border-bottom py-2">
              <strong>{p.title}</strong>
              <div className="text-muted small">
                ${p.price} · {p.type}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No has publicado materiales aún.</p>
        )}
      </div>
    </div>
  );
};

// Componentes internos para evitar repetición
const StatCard = ({ title, value, color = "" }) => (
  <div className="col-md-4 mb-3">
    <div className="card border-0 shadow-sm p-3 text-center h-100">
      <h6 className="text-muted">{title}</h6>
      <h2 className={`fw-bold ${color}`}>{value}</h2>
    </div>
  </div>
);

const MetricSmall = ({ title, value, border }) => (
  <div className="col-md-3 mb-3">
    <div
      className={`card ${border} border-start border-4 shadow-sm p-3 text-center`}
    >
      <small className="text-muted">{title}</small>
      <h4 className="fw-bold mb-0">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
