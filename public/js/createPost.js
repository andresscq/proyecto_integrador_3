// js/createpost.js

document.getElementById("postForm").addEventListener("submit", e => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if (!user) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  const post = {
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    type: document.getElementById("type").value.trim(),
    price: Number(document.getElementById("price").value),
    description: document.getElementById("description").value.trim(),
    image:
      document.getElementById("image").value.trim() ||
      "https://via.placeholder.com/300",
    user: user.email,
    approved: false
  };

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push(post);
  localStorage.setItem("posts", JSON.stringify(posts));

  alert("Post enviado para revisión");
  window.location.href = "dashboard.html";
});
