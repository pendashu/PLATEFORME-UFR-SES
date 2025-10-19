document.addEventListener("DOMContentLoaded", function () {
  const depenses = JSON.parse(localStorage.getItem("depenses")) || [];
  const listeDepenses = document.getElementById("listeDepenses");
  const depensesEl = document.getElementById("depenses");
  const soldeEl = document.getElementById("solde");
  const statutEl = document.getElementById("statut");

  const budgetTotal = parseFloat(localStorage.getItem("budgetTotal")) || 1500000;
  const totalDepenses = depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const solde = budgetTotal - totalDepenses;

  // Afficher les totaux
  depensesEl.textContent = `${totalDepenses.toLocaleString()} FCFA`;
  soldeEl.textContent = `${solde.toLocaleString()} FCFA`;

  if (solde < 0) {
    statutEl.textContent = "🔴 Dépassement";
    statutEl.style.color = "red";
  } else if (solde < budgetTotal * 0.2) {
    statutEl.textContent = "⚠️ Attention";
    statutEl.style.color = "orange";
  } else {
    statutEl.textContent = "✅ Normal";
    statutEl.style.color = "green";
  }

  // Afficher l'historique
  listeDepenses.innerHTML = "";
  if (depenses.length === 0) {
    listeDepenses.innerHTML = "<li>Aucune dépense enregistrée.</li>";
  } else {
    depenses.forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.date} : ${d.motif} – ${d.montant} FCFA`;
      listeDepenses.appendChild(li);
    });
  }
});
const role = user.role;

if (user.role !== "comptable_finance") {
  alert("❌ Accès refusé : uniquement pour le comptable finance.");
  window.location.href = "index.html";
}