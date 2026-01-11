const container = document.getElementById("materials");

/* =========================
   DATOS DEMO (CLASE)
========================= */
const demoMaterials = [
  {
    title: "Cemento reciclado",
    description: "Cemento reutilizado de construcciones anteriores",
    price: 15,
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
    type: "Cemento",
    phone: "593999999999"
  },
  {
    title: "Madera reutilizada",
    description: "Tablones de madera recuperados",
    price: 10,
    image: "https://images.unsplash.com/photo-1604014237744-1d1c0f8c43cc",
    type: "Madera",
    phone: "593999999999"
  },
  {
    title: "Acero recuperado",
    description: "Acero estructural reciclado",
    price: 25,
    image: "https://images.unsplash.com/photo-1581091215367-59ab6c1a1d0b",
    type: "Metal",
    phone: "593999999999"
  },
  {
    title: "Ladrillos reciclados",
    description: "Ladrillos reutilizables en buen estado",
    price: 12,
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",
    type: "Ladrillo",
    phone: "593999999999"
  }
];

/* =========================
   CONSTANTES IMPACTO
========================= */
const KG_PER_MATERIAL = 25;
const BOTTLES_PER_KG = 2;

/* =========================
   WHATSAPP
========================= */
function getWhatsappLink(material) {
  const phone =
    material.phone ||
    (material.user && material.user.phone) ||
    "593999999999";

  const message = encodeURIComponent(
    `Hola, me interesa el material "${material.title}". ¿Sigue disponible?`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

/* =========================
   FETCH BACKEND (MONGO)
========================= */
async function fetchMaterialsFromAPI() {
  try {
    const res = await fetch("http://localhost:3000/api/materials");
    if (!res.ok) throw new Error("No API");
    return await res.json();
  } catch (err) {
    console.warn("⚠️ Backend no disponible, usando fallback");
    return [];
  }
}

/* =========================
   RENDER PRINCIPAL
========================= */
async function renderMaterials(search = "", type = "", priceRange = "") {
  let list = [];

  // 1️⃣ Intentar BACKEND
  const apiMaterials = await fetchMaterialsFromAPI();
  if (apiMaterials.length > 0) {
    list = apiMaterials;
  }

  // 2️⃣ Fallback → localStorage
  if (list.length === 0) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    list = posts.filter(p => p.approved === true);
  }

  // 3️⃣ Fallback → DEMO
  if (list.length === 0) {
    list = demoMaterials;
  }

  // 🔍 FILTRO TEXTO
  if (search) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(search) ||
      (p.description || "").toLowerCase().includes(search)
    );
  }

  // 🧱 FILTRO TIPO
  if (type) {
    list = list.filter(p =>
      (p.type || p.category || "").toLowerCase().includes(type.toLowerCase())
    );
  }

  // 💰 FILTRO PRECIO
  if (priceRange) {
    list = list.filter(p => {
      if (priceRange === "low") return p.price < 20;
      if (priceRange === "mid") return p.price >= 20 && p.price <= 100;
      if (priceRange === "high") return p.price > 100;
      return true;
    });
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted">
        No se encontraron materiales
      </div>
    `;
    return;
  }

  list.forEach(p => {
    const impactKg = KG_PER_MATERIAL;
    const bottles = impactKg * BOTTLES_PER_KG;
    const whatsappLink = getWhatsappLink(p);

    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card material-card h-100 position-relative">

          <span class="badge bg-success position-absolute top-0 end-0 m-2">
            +${impactKg} kg
          </span>

          <img src="${p.image}" class="card-img-top" alt="${p.title}">

          <div class="card-body d-flex flex-column">
            <h5 class="fw-bold">${p.title}</h5>
            <p class="text-muted">${p.description || ""}</p>

            <p class="fw-bold mb-1">Precio: $${p.price}</p>

            <small class="text-success mb-3">
              Equivale a reciclar ${bottles} botellas
            </small>

            <a
              href="${whatsappLink}"
              target="_blank"
              class="btn btn-success mt-auto"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

renderMaterials();
