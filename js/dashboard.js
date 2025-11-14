// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  // Charger toutes les données
  const budgetTotal = localStorage.getItem("budgetTotal") || "1 500 000";
  const depenses = JSON.parse(localStorage.getItem("depenses")) || [];
  const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
  const solde = parseInt(budgetTotal) - totalDepenses;

  // Mettre à jour le budget
  document.getElementById("budgetTotal").textContent = parseInt(budgetTotal).toLocaleString();
  document.getElementById("depenses").textContent = totalDepenses.toLocaleString();
  document.getElementById("solde").textContent = solde.toLocaleString();

  const statutBudget = document.getElementById("statutBudget");
  if (solde < 0) {
    statutBudget.textContent = "🚨 CRITIQUE – Dépassement";
    statutBudget.className = "critical";
  } else if (solde < budgetTotal * 0.2) {
    statutBudget.textContent = "⚠️ Attention – Solde faible";
    statutBudget.className = "alert";
  } else {
    statutBudget.textContent = "✅ Normal";
    statutBudget.className = "ok";
  }

  // Stocks critiques
  const materiels = JSON.parse(localStorage.getItem("materiels")) || [];
  const stocksCritiques = materiels.filter(m => m.stock <= m.seuil);

  const tableauStocksCritiques = document.querySelector("#tableauStocksCritiques tbody");
  const stockAlerte = document.getElementById("stockAlerte");

  if (stocksCritiques.length === 0) {
    stockAlerte.textContent = "Aucun stock critique.";
    tableauStocksCritiques.innerHTML = "";
  } else {
    stockAlerte.textContent = `${stocksCritiques.length} article(s) en dessous du seuil.`;
    tableauStocksCritiques.innerHTML = "";
    stocksCritiques.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.nom}</td>
        <td>${m.stock}</td>
        <td>${m.seuil}</td>
      `;
      tableauStocksCritiques.appendChild(tr);
    });
  }

  // PER > 500 000 FCFA en attente
  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  const perUrgents = perListe.filter(p => p.montant > 500000);

  const tableauPER = document.querySelector("#tableauPER tbody");
  const perAlerte = document.getElementById("perAlerte");

  if (perUrgents.length === 0) {
    perAlerte.textContent = "Aucun besoin > 500 000 FCFA en attente.";
    tableauPER.innerHTML = "";
  } else {
    perAlerte.textContent = `${perUrgents.length} demande(s) nécessitant une validation.`;
    tableauPER.innerHTML = "";
    perUrgents.slice(-5).forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.date}</td>
        <td>${p.demandeur}</td>
        <td>${p.objet}</td>
        <td>${p.montant.toLocaleString()} FCFA</td>
      `;
      tableauPER.appendChild(tr);
    });
  }

  // Carburant
  const pleins = JSON.parse(localStorage.getItem("pleins")) || [];

  document.getElementById("nbPleins").textContent = pleins.length;

  const consoValues = pleins
    .map(p => parseFloat(p.conso))
    .filter(c => !isNaN(c) && c > 0);

  const consoMoyenne = consoValues.length > 0
    ? (consoValues.reduce((a, b) => a + b, 0) / consoValues.length).toFixed(2)
    : "–";

  document.getElementById("consoMoyenne").textContent = consoMoyenne;

  if (pleins.length > 0) {
    const dernier = pleins[pleins.length - 1];
    document.getElementById("dernierPlein").textContent =
      `${dernier.date} – ${dernier.vehicule} – ${dernier.quantite} L`;
  } else {
    document.getElementById("dernierPlein").textContent = "Aucun plein";
  }
});