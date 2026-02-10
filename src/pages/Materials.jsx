import React, { useState, useEffect } from "react";

const Materials = () => {
  // 1. Estados para datos y filtros
  const [list, setList] = useState([]); // La lista que mostramos
  const [allData, setAllData] = useState([]); // Backup de todos los datos
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // 2. Lógica de Impacto (Calculada automáticamente)
  const approvedCount = allData.length;
  const kgEvitados = approvedCount * 25;
  const treesSaved = Math.floor(kgEvitados / 20);

  // 3. Carga de datos inicial (useEffect)
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/materials");
        const data = await res.json();
        if (data.length > 0) {
          setAllData(data);
          return;
        }
      } catch (err) {
        console.warn("API no disponible");
      }

      // Fallback: LocalStorage o Demo
      const localPosts =
        JSON.parse(localStorage.getItem("posts"))?.filter((p) => p.approved) ||
        [];
      setAllData(localPosts.length > 0 ? localPosts : demoMaterials);
    };
    loadData();
  }, []);

  // 4. Efecto de Filtrado: Se ejecuta cada vez que cambia search, type o priceRange
  useEffect(() => {
    let filtered = [...allData];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (type) {
      filtered = filtered.filter((p) =>
        p.type?.toLowerCase().includes(type.toLowerCase()),
      );
    }
    if (priceRange) {
      filtered = filtered.filter((p) => {
        if (priceRange === "low") return p.price < 20;
        if (priceRange === "mid") return p.price >= 20 && p.price <= 100;
        if (priceRange === "high") return p.price > 100;
        return true;
      });
    }
    setList(filtered);
  }, [search, type, priceRange, allData]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Materiales disponibles</h2>

      {/* Caja de Impacto */}
      <div className="impact-box mb-4 p-3 bg-white rounded shadow-sm">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="impact-number text-success">{approvedCount}</div>
            <div className="text-muted">Materiales reutilizados</div>
          </div>
          <div className="col-md-4">
            <div className="impact-number text-primary">{kgEvitados} kg</div>
            <div className="text-muted">Residuos evitados</div>
          </div>
          <div className="col-md-4">
            <div className="impact-number text-success">{treesSaved}</div>
            <div className="text-muted">Árboles salvados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row g-3 mb-4 p-3 bg-white rounded shadow-sm">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Todos los materiales</option>
            <option value="Madera">Madera</option>
            <option value="Metal">Metal</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Precio</option>
            <option value="low">Menor a $20</option>
          </select>
        </div>
      </div>

      {/* Grid de Materiales */}
      <div className="row">
        {list.map((p, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card material-card h-100 shadow-sm">
              <span className="badge bg-success position-absolute top-0 end-0 m-2">
                +25 kg
              </span>
              <img
                src={p.image}
                className="card-img-top"
                alt={p.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{p.title}</h5>
                <p className="text-muted small">{p.description}</p>
                <p className="fw-bold mt-auto">Precio: ${p.price}</p>
                <a
                  href={`https://wa.me/${p.phone || "593999999999"}`}
                  target="_blank"
                  className="btn btn-success w-100"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Datos Demo para que no se vea vacío
const demoMaterials = [
  {
    title: "Madera reutilizada",
    price: 10,
    image: "https://images.unsplash.com/photo-1604014237744-1d1c0f8c43cc",
    type: "Madera",
  },
  {
    title: "Acero recuperado",
    price: 25,
    image: "https://images.unsplash.com/photo-1581091215367-59ab6c1a1d0b",
    type: "Metal",
  },
];

export default Materials;
