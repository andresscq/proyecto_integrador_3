import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const slides = [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  ];

  // --- 📝 FUNCIÓN DE INFORME ---
  const descargarInforme = () => {
    const originalTitle = document.title;
    document.title = "Reporte_Gestion_ReConstruye_EC";
    window.print();
    document.title = originalTitle;
  };

  // --- ⌨️ CAPTURA DE TECLA F1 (CORREGIDA) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Usamos el código de tecla para mayor precisión
      if (e.key === "F1" || e.keyCode === 112) {
        e.preventDefault();
        e.stopPropagation(); // Detiene cualquier otro proceso del navegador
        descargarInforme();
      }
    };

    // Usamos 'keydown' en window para capturar antes que el navegador
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  // Lógica del Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="home-container">
      {/* 📄 INFORME PARA EL PDF (Solo visible al imprimir) */}
      <div
        className="d-none d-print-block p-5"
        style={{ minHeight: "100vh", backgroundColor: "white" }}
      >
        <div className="d-flex justify-content-between align-items-center border-bottom border-4 border-success pb-3">
          <div>
            <h1 className="text-success fw-bold mb-0">RECONSTRUYE EC</h1>
            <p className="lead text-muted">
              Gestión de Materiales Sostenibles - Ecuador
            </p>
          </div>
          <div className="text-end">
            <p className="mb-0">
              <strong>ID Reporte:</strong> #RC-
              {Math.floor(1000 + Math.random() * 9000)}
            </p>
            <p className="mb-0">
              <strong>Fecha:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h3 className="fw-bold text-success border-bottom">
              1. Resumen Técnico del Sistema
            </h3>
            <p className="mt-3">
              El sistema opera bajo una arquitectura distribuida. La seguridad y
              gestión de identidades está centralizada en{" "}
              <strong>PostgreSQL</strong> mediante{" "}
              <strong>Procedimientos Almacenados</strong>, mientras que la
              persistencia del catálogo se gestiona en <strong>MongoDB</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 border bg-light text-center">
          <h5 className="fw-bold">ESTADO DE INTEGRACIÓN</h5>
          <div className="row mt-3">
            <div className="col-4 border-end">
              <strong>PostgreSQL:</strong> Conectado
            </div>
            <div className="col-4 border-end">
              <strong>MongoDB:</strong> Conectado
            </div>
            <div className="col-4">
              <strong>WhatsApp API:</strong> Activo
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="fw-bold text-success border-bottom">
            2. Métricas de Impacto Ambiental
          </h3>
          <div className="progress mt-3" style={{ height: "30px" }}>
            <div className="progress-bar bg-success" style={{ width: "85%" }}>
              85% Meta de Reciclaje Lograda
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 row">
          <div className="col-6 text-center">
            <div
              className="mx-auto border-top border-dark pt-2"
              style={{ width: "200px" }}
            >
              Firma TI
            </div>
          </div>
          <div className="col-6 text-center">
            <div
              className="mx-auto border-top border-dark pt-2"
              style={{ width: "200px" }}
            >
              Sello ReConstruye
            </div>
          </div>
        </div>
      </div>

      {/* 🌐 CONTENIDO WEB (No se imprime) */}
      <div className="no-print">
        <div
          className="container mt-3 text-end"
          style={{ position: "absolute", zIndex: 100, right: 20 }}
        >
          <button
            onClick={descargarInforme}
            className="btn btn-danger shadow-lg fw-bold border-2"
          >
            📄 Informe PDF (F1)
          </button>
        </div>

        <section className="hero">
          {slides.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
          <div className="hero-overlay"></div>
          <div className="container hero-content text-center">
            <h1 className="display-4 fw-bold text-white">
              Construyendo un futuro sostenible
            </h1>
            <p className="lead text-white mt-4">
              Compra y venta de materiales de construcción reciclados
            </p>
            <Link
              to={user ? "/Materials" : "/Login"}
              className="btn btn-primary btn-lg mt-4 px-5"
            >
              Comenzar
            </Link>
          </div>
        </section>

        <section className="container py-5 text-center">
          <div className="row justify-content-center py-5">
            <div className="col-md-4">
              <h4 className="fw-bold text-success"></h4>
              <p>
                Eliminamos el desperdicio en las construcciones mediante
                economía circular. Facilitamos el intercambio seguro de
                materiales recuperados en todo el país.
              </p>
            </div>
            <div className="col-md-4 border-start border-end">
              <h4 className="fw-bold text-success"></h4>
              <p>
                Transformamos residuos de obra en recursos valiosos para la
                industria. Conectamos proveedores y constructores para edificar
                un futuro sostenible
              </p>
            </div>
            <div className="col-md-4">
              <h4 className="fw-bold text-success"></h4>
              <p>
                En ReConstruye, buscamos proporcionar una solución sencilla para
                la compra y venta de materiales reciclables de construcción. .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
