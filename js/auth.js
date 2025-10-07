// === FONCTION GLOBALE DE VÉRIFICATION ===
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// === CODE SPÉCIFIQUE À LA PAGE DE LOGIN ===
if (document.getElementById("formLogin")) {
  document.getElementById("formLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");

    const USERS = [
      { username: "comptable", password: "compta2025", role: "comptable", name: "Comptable" },
      { username: "directeur", password: "direc2025", role: "directeur", name: "Directeur" },
      { username: "csa", password: "csa2025", role: "csa", name: "CSA" }
    ];

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      errorDiv.style.display = "block";
      errorDiv.textContent = "Identifiant ou mot de passe incorrect.";
    }
  });
}
function exporterEnExcel() {
  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  
  // Préparer les données
  const data = perListe.map(p => ({
    "Date": p.date,
    "Demandeur": p.demandeur,
    "Service": p.service,
    "Objet": p.objet,
    "Montant (FCFA)": p.montant,
    "Statut": p.montant > 500000 ? "À valider" : "OK"
  }));

  // Créer un classeur
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "PER");

  // Générer et télécharger
  XLSX.writeFile(wb, "Données_PER_UFR_SES.xlsx");
}