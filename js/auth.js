// Liste complète des utilisateurs
const USERS = [
  { username: "matiere", password: "matiere2025", role: "comptable_matiere", name: "Comptable Matière" },
  { username: "finance", password: "finance2025", role: "comptable_finance", name: "Comptable Finance" },
  { username: "directeur", password: "direc2025", role: "directeur", name: "Directeur UFR" },
  { username: "csa", password: "csa2025", role: "csa", name: "CSA" }
];

// Gestion de la connexion
document.getElementById("formLogin")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error");

  const user = USERS.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    errorDiv.style.display = "block";
    errorDiv.textContent = "Identifiant ou mot de passe incorrect.";
  }
});

// Fonction de vérification d'authentification
function checkAuth() {
  const userData = localStorage.getItem("user");
  if (!userData) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(userData);
}