const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value; // 👈 CLAVE

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone, // 👈 CLAVE
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    message.style.color = "red";
    message.textContent = data.message || "Error al registrarse";
    return;
  }

  message.style.color = "green";
  message.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});
