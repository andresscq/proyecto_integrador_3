import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const navigate = useNavigate();

  const slides = [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  ];

  // Lógica del Slider automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
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
          <p className="lead mt-4 text-white">
            Compra y venta de materiales reciclables de construcción
          </p>
          <Link
            to={user ? "/Materials" : "/Login"}
            className="btn btn-primary btn-lg mt-3"
          >
            Comenzar
          </Link>
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="container py-5 text-center">
        <p className="fs-5">
          En ReConstruye, buscamos proporcionar una solución sencilla para la
          compra y venta de materiales reciclables de construcción.
        </p>
      </section>

      {/* FEATURES */}
      <section className="container py-5">
        <div className="row text-center g-4">
          <FeatureCard
            title="Materiales reciclados"
            desc="Compra y venta segura."
          />
          <FeatureCard
            title="Usuarios verificados"
            desc="Publicaciones de confianza."
          />
          <FeatureCard
            title="Panel administrativo"
            desc="Moderación y control."
          />
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="bg-light py-5">
          <div className="container text-center">
            <h2 className="fw-bold mb-3">¿Listo para comenzar?</h2>
            <Link to="/Register" className="btn btn-success btn-lg me-2">
              Registrarse
            </Link>
            <Link to="/Login" className="btn btn-outline-dark btn-lg">
              Iniciar sesión
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="col-md-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="fw-bold">{title}</h5>
        <p>{desc}</p>
      </div>
    </div>
  </div>
);

export default Home;
