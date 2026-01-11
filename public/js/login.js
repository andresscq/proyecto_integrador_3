// js/login.js

const form = document.getElementById("loginForm");
const errorText = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorText.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorText.textContent = "Completa todos los campos";
    return;
  }

  try {
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

    // ✅ GUARDAR SESIÓN COMO ESPERA auth.js
    const loggedUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role || "user", // user | admin
      token: data.token,
    };

    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    // 🔁 Redirigir al dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    errorText.textContent = "No se pudo conectar con el servidor";
    console.error(error);
  }
});
