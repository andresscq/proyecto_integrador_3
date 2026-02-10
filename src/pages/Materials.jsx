import React, { useState, useEffect } from "react";

const Materials = () => {
  const [list, setList] = useState([]); // Lo que se ve en pantalla
  const [allData, setAllData] = useState([]); // Todo lo aprobado de la DB
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Carga de datos desde MongoDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/materials");
        const data = await res.json();

        // 🛡️ FILTRO DE SEGURIDAD: Solo guardamos los que el admin ya aprobó
        const approvedMaterials = data.filter((p) => p.approved === true);

        setAllData(approvedMaterials);
        setLoading(false);
      } catch (err) {
        console.error("Error conectando con la API:", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Lógica de Impacto Ambiental (Basada solo en lo aprobado)
  const approvedCount = allData.length;
  const kgEvitados = approvedCount * 25;
  const treesSaved = Math.floor(kgEvitados / 20);

  // 3. Sistema de Filtrado en tiempo real
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
        (p.category || p.type)?.toLowerCase().includes(type.toLowerCase()),
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

  if (loading)
    return (
      <div className="text-center mt-5">
        Cargando materiales sustentables...
      </div>
    );

  return (
    <div className="container mt-4 pb-5">
      <h2 className="fw-bold mb-4">Catálogo de Materiales</h2>

      {/* Caja de Impacto Ambiental */}
      <div className="impact-box mb-4 p-4 bg-white rounded shadow-sm border-start border-success border-5">
        <div className="row text-center align-items-center">
          <div className="col-md-4 border-end">
            <div className="h2 fw-bold text-success mb-0">{approvedCount}</div>
            <div className="small text-uppercase text-muted fw-bold">
              Materiales Aprobados
            </div>
          </div>
          <div className="col-md-4 border-end">
            <div className="h2 fw-bold text-primary mb-0">{kgEvitados} kg</div>
            <div className="small text-uppercase text-muted fw-bold">
              CO2 Evitado
            </div>
          </div>
          <div className="col-md-4">
            <div className="h2 fw-bold text-success mb-0">{treesSaved}</div>
            <div className="small text-uppercase text-muted fw-bold">
              Árboles Salvados
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="row g-3 mb-4 p-3 bg-light rounded shadow-sm border">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="¿Qué material buscas?"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Madera">Madera</option>
            <option value="Metal">Metal</option>
            <option value="Ladrillo">Ladrillo</option>
            <option value="Cemento">Cemento</option>
            <option value="Vidrio">Vidrio</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Rango de Precio</option>
            <option value="low">Económico (Menos de $20)</option>
            <option value="mid">Intermedio ($20 - $100)</option>
            <option value="high">Premium (Más de $100)</option>
          </select>
        </div>
      </div>

      {/* Grid de Materiales */}
      <div className="row">
        {list.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">
              No se encontraron materiales aprobados.
            </h4>
          </div>
        ) : (
          list.map((p) => (
            <div className="col-md-4 mb-4" key={p._id}>
              <div className="card h-100 shadow-sm border-0 material-card">
                <div className="position-relative">
                  <span className="badge bg-success position-absolute top-0 end-0 m-2">
                    Eco-Friendly
                  </span>
                  <img
                    src={p.image || "https://via.placeholder.com/300"}
                    className="card-img-top"
                    alt={p.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-uppercase text-muted small fw-bold">
                      {p.category || "General"}
                    </span>
                    <span className="text-success fw-bold">${p.price}</span>
                  </div>
                  <h5 className="fw-bold mb-2">{p.title}</h5>
                  <p className="text-muted small mb-4" style={{ flexGrow: 1 }}>
                    {p.description?.substring(0, 100)}...
                  </p>
                  <a
                    href={`https://wa.me/${p.user?.phone?.replace(/\D/g, "") || "593999999999"}?text=${encodeURIComponent(`Hola ${p.user?.name || "Vendedor"}, me interesa tu material: ${p.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-success w-100 fw-bold"
                  >
                    Contactar Vendedor
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Materials;
