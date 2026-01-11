function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (!user || user.role !== "admin") {
    window.location.href = "dashboard.html";
  }
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];
const table = document.getElementById("adminTable");

function renderAdmin() {
  table.innerHTML = "";

  if (posts.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          No hay publicaciones
        </td>
      </tr>
    `;
    return;
  }

  posts.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.title}</td>
        <td>${p.type}</td>
        <td>$${p.price}</td>
        <td>${p.user}</td>
        <td>
          ${p.approved 
            ? '<span class="badge bg-success">Aprobado</span>'
            : '<span class="badge bg-warning text-dark">Pendiente</span>'}
        </td>
        <td>
          ${!p.approved ? `
            <button class="btn btn-success btn-sm me-1"
              onclick="approvePost(${p.id})">
              Aprobar
            </button>
          ` : ""}
          <button class="btn btn-danger btn-sm"
            onclick="deletePost(${p.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

function approvePost(id) {
  posts = posts.map(p =>
    p.id === id ? { ...p, approved: true } : p
  );
  localStorage.setItem("posts", JSON.stringify(posts));
  renderAdmin();
}

function deletePost(id) {
  if (!confirm("¿Eliminar esta publicación?")) return;
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderAdmin();
}

renderAdmin();
