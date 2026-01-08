// 🔒 Verificar sesión
const token = sessionStorage.getItem("token");

if (!token || token === "undefined") {
  window.location.href = "login.html";
}

// 👤 Datos del usuario logueado
const username = sessionStorage.getItem("username");
const loggedUserId = sessionStorage.getItem("userId");

const userSpan = document.getElementById("username");
if (userSpan && username) {
  userSpan.textContent = username;
}

// 📦 Elementos del DOM
const list = document.getElementById("materialsList");
const form = document.getElementById("materialForm");
const searchInput = document.getElementById("search");

// 📲 Formatear número para WhatsApp (Ecuador)
function formatWhatsappNumber(phone) {
  if (!phone) return null;

  let clean = phone.replace(/\D/g, "");

  // Si empieza con 0 → Ecuador
  if (clean.startsWith("0")) {
    clean = "593" + clean.substring(1);
  }

  // Si tiene 9 dígitos y no empieza con 593
  if (!clean.startsWith("593") && clean.length === 9) {
    clean = "593" + clean;
  }

  return clean;
}

// 📥 Cargar materiales
async function loadMaterials() {
  try {
    const response = await fetch("/api/materials");
    const materials = await response.json();

    list.innerHTML = "";

    if (!materials || materials.length === 0) {
      list.innerHTML = "<p>No hay materiales publicados</p>";
      return;
    }

    materials.forEach((m) => {
      const card = document.createElement("div");
      card.className = "card";

      const isOwner = m.user && m.user._id === loggedUserId;
      const phone = formatWhatsappNumber(m.user?.phone);

      const whatsappLink = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(
            "Hola, me interesa el material: " + m.title
          )}`
        : null;

      card.innerHTML = `
        <h3>${m.title}</h3>
        <p><strong>Categoría:</strong> ${m.category}</p>
        <p><strong>Ubicación:</strong> ${m.location}</p>
        <p>${m.description || ""}</p>
        <p>
          <strong>Contacto:</strong>
          ${m.user ? `${m.user.name} - ${m.user.phone}` : "No disponible"}
        </p>

        ${
          whatsappLink
            ? `<a href="${whatsappLink}" target="_blank">
                 <button class="interest-btn">Me interesa</button>
               </a>`
            : ""
        }

        ${
          isOwner
            ? `<button class="delete-btn" data-id="${m._id}">Eliminar</button>`
            : ""
        }
      `;

      list.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar materiales", error);
  }
}

// 📝 Publicar material
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title,
          category,
          location,
          description,
        }),
      });

      if (!response.ok) {
        alert("Error al publicar el material");
        return;
      }

      form.reset();
      loadMaterials();
    } catch (error) {
      console.error("Error al publicar material", error);
    }
  });
}

// 🔍 Buscar materiales
async function searchMaterials() {
  const search = searchInput.value.trim();

  try {
    const response = await fetch(`/api/materials?search=${search}`);
    const materials = await response.json();

    list.innerHTML = "";

    if (!materials || materials.length === 0) {
      list.innerHTML = "<p>No se encontraron resultados</p>";
      return;
    }

    materials.forEach((m) => {
      const card = document.createElement("div");
      card.className = "card";

      const isOwner = m.user && m.user._id === loggedUserId;
      const phone = formatWhatsappNumber(m.user?.phone);

      const whatsappLink = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(
            "Hola, me interesa el material: " + m.title
          )}`
        : null;

      card.innerHTML = `
        <h3>${m.title}</h3>
        <p><strong>Categoría:</strong> ${m.category}</p>
        <p><strong>Ubicación:</strong> ${m.location}</p>
        <p>${m.description || ""}</p>
        <p>
          <strong>Contacto:</strong>
          ${m.user ? `${m.user.name} - ${m.user.phone}` : "No disponible"}
        </p>

        ${
          whatsappLink
            ? `<a href="${whatsappLink}" target="_blank">
                 <button class="interest-btn">Me interesa</button>
               </a>`
            : ""
        }

        ${
          isOwner
            ? `<button class="delete-btn" data-id="${m._id}">Eliminar</button>`
            : ""
        }
      `;

      list.appendChild(card);
    });
  } catch (error) {
    console.error("Error en la búsqueda", error);
  }
}

// 🗑️ Eliminar material (solo dueño)
list.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const materialId = e.target.dataset.id;

  if (!confirm("¿Seguro que deseas eliminar este material?")) return;

  try {
    const response = await fetch(`/api/materials/${materialId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      alert("No puedes eliminar este material");
      return;
    }

    loadMaterials();
  } catch (error) {
    console.error("Error al eliminar material", error);
  }
});

// 🚪 Cerrar sesión
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// 🚀 Inicializar
loadMaterials();
