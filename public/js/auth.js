// js/auth.js

function getUser() {
  return JSON.parse(localStorage.getItem("loggedUser"));
}

function requireAuth() {
  if (!getUser()) {
    window.location.href = "login.html";
  }
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    alert("Acceso denegado");
    window.location.href = "dashboard.html";
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}
