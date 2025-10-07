// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  // Charger les données sauvegardées
  const depenses = JSON.parse(localStorage.getItem("depenses")) || [];
  const budgetTotal = localStorage.getItem("budgetTotal") || 1500000;

  // Mettre à jour les champs
  document.getElementById("budgetTotal").value = budgetTotal;

  // Afficher les dépenses
  afficherDepenses(depenses);
  mettreAJourResume();
});

// Ajouter une dépense
document.getElementById("formDepense").addEventListener("submit", function (e) {
  e.preventDefault();

  const motif = document.getElementById("motif").value;
  const montant = parseFloat(document.getElementById("montant").value);
  const date = new Date().toLocaleDateString("fr-MA");

  // Récupérer les anciennes dépenses
  let depenses = JSON.parse(localStorage.getItem("depenses")) || [];

  // Ajouter la nouvelle
  depenses.push({ motif, montant, date });
  localStorage.setItem("depenses", JSON.stringify(depenses));

  // Mettre à jour l'affichage
  afficherDepenses(depenses);
  mettreAJourResume();

  // Réinitialiser le formulaire
  this.reset();
});

// Fonction pour afficher la liste des dépenses
function afficherDepenses(depenses) {
  const liste = document.getElementById("listeDepenses");
  if (depenses.length === 0) {
    liste.innerHTML = "<li>Aucune dépense enregistrée.</li>";
  } else {
    liste.innerHTML = "";
    depenses.forEach((d, i) => {
      const li = document.createElement("li");
      li.textContent = `${d.date} - ${d.motif} : ${d.montant.toLocaleString()} FCFA`;
      liste.appendChild(li);
    });
  }
}

// Fonction pour mettre à jour le résumé
function mettreAJourResume() {
  const depenses = JSON.parse(localStorage.getItem("depenses")) || [];
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const budgetTotal = parseFloat(document.getElementById("budgetTotal").value);

  // Sauvegarder le budget modifié
  localStorage.setItem("budgetTotal", budgetTotal);

  const solde = budgetTotal - totalDepenses;

  // Afficher les résultats
  document.getElementById("depenses").textContent = totalDepenses.toLocaleString() + " FCFA";
  document.getElementById("solde").textContent = solde.toLocaleString() + " FCFA";

  const statut = document.getElementById("statut");
  if (solde < 0) {
    statut.textContent = "🚨 CRITIQUE – Dépassement";
    statut.style.color = "red";
  } else if (solde < budgetTotal * 0.2) {
    statut.textContent = "⚠️ Attention – Solde faible";
    statut.style.color = "orange";
  } else {
    statut.textContent = "✅ Normal";
    statut.style.color = "green";
  }
}

// Mettre à jour le résumé si le budget est modifié
document.getElementById("budgetTotal").addEventListener("change", function () {
  localStorage.setItem("budgetTotal", this.value);
  mettreAJourResume();
});