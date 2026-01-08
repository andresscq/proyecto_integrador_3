const form = document.getElementById("loginForm");
const errorText = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    errorText.textContent = data.message || "Error al iniciar sesión";
    return;
  }

  // 🔐 GUARDAR SESIÓN COMPLETA
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("username", data.name);
  sessionStorage.setItem("userId", data.id); // 🔥 ESTO FALTABA

  window.location.href = "index.html";
});
