const container = document.getElementById("materials");

/*  DATOS DEMO  */
const demoMaterials = [
  {
    title: "Cemento reciclado",
    description: "Cemento reutilizado de construcciones anteriores",
    price: 15,
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
    type: "Cemento"
  },
  {
    title: "Madera reutilizada",
    description: "Tablones de madera recuperados",
    price: 10,
    image: "https://images.unsplash.com/photo-1604014237744-1d1c0f8c43cc",
    type: "Madera"
  },
  {
    title: "Acero recuperado",
    description: "Acero estructural reciclado",
    price: 25,
    image: "https://images.unsplash.com/photo-1581091215367-59ab6c1a1d0b",
    type: "Metal"
  },
  {
    title: "Ladrillos reciclados",
    description: "Ladrillos reutilizables en buen estado",
    price: 12,
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",
    type: "Ladrillo"
  }
];

/*  CONSTANTES DE IMPACTO (DEMO) */
const KG_PER_MATERIAL = 25;
const BOTTLES_PER_KG = 2;

/* RENDER PRINCIPAL */
function renderMaterials(search = "", type = "", priceRange = "") {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // SOLO APROBADOS
  let list = posts.filter(p => p.approved === true);

  // SI NO HAY POSTS, USA DEMO
  if (list.length === 0) {
    list = demoMaterials;
  }

  // FILTRO TEXTO
  if (search) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(search) ||
      (p.description || "").toLowerCase().includes(search)
    );
  }

  // FILTRO TIPO
  if (type) {
    list = list.filter(p => (p.type || "").includes(type));
  }

  //  FILTRO PRECIO
  if (priceRange) {
    list = list.filter(p => {
      if (priceRange === "low") return p.price < 20;
      if (priceRange === "mid") return p.price >= 20 && p.price <= 100;
      if (priceRange === "high") return p.price > 100;
    });
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted">
        No se encontraron materiales con esos filtros
      </div>
    `;
    return;
  }

  list.forEach(p => {
    const impactKg = KG_PER_MATERIAL;
    const bottles = impactKg * BOTTLES_PER_KG;

    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card material-card h-100 position-relative">

          <!--  Impacto visual -->
          <span class="badge bg-success position-absolute top-0 end-0 m-2">
             +${impactKg} kg
          </span>

          <img src="${p.image}" class="card-img-top" alt="${p.title}">

          <div class="card-body">
            <h5 class="fw-bold">${p.title}</h5>
            <p class="text-muted">${p.description || ""}</p>

            <p class="fw-bold mb-1">Precio: $${p.price}</p>

            <small class="text-success">
               Equivale a reciclar ${bottles} botellas
            </small>
          </div>
        </div>
      </div>
    `;
  });
}

renderMaterials();
