// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  const pleins = JSON.parse(localStorage.getItem("pleins")) || [];
  afficherPleins(pleins);
  mettreAJourResume(pleins);
});

// Enregistrer un nouveau plein
document.getElementById("formCarburant").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("datePlein").value;
  const vehicule = document.getElementById("vehicule").value;
  const conducteur = document.getElementById("conducteur").value;
  const km = parseInt(document.getElementById("kilometrage").value);
  const quantite = parseFloat(document.getElementById("quantite").value);
  const cout = parseInt(document.getElementById("cout").value);

  // Récupérer les anciens pleins
  let pleins = JSON.parse(localStorage.getItem("pleins")) || [];

  // Calcul de la consommation (si précédent)
  let conso = "–";
  if (pleins.length > 0) {
    const dernier = pleins[pleins.length - 1];
    const distance = km - dernier.kilometrage;
    if (distance > 0 && quantite > 0) {
      conso = ((quantite / distance) * 100).toFixed(2); // L/100km
    }
  }

  // Ajouter le nouveau plein
  pleins.push({
    id: Date.now(),
    date,
    vehicule,
    conducteur,
    kilometrage: km,
    quantite,
    cout,
    conso
  });

  // Sauvegarder
  localStorage.setItem("pleins", JSON.stringify(pleins));

  // Mettre à jour l'affichage
  afficherPleins(pleins);
  mettreAJourResume(pleins);

  // Réinitialiser le formulaire
  this.reset();
});

// Afficher l'historique des pleins
function afficherPleins(pleins) {
  const tbody = document.querySelector("#tableauPleins tbody");
  tbody.innerHTML = "";

  if (pleins.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7'>Aucun plein enregistré.</td></tr>";
    return;
  }

  pleins.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.date}</td>
      <td>${p.vehicule}</td>
      <td>${p.conducteur}</td>
      <td>${p.kilometrage.toLocaleString()}</td>
      <td>${p.quantite} L</td>
      <td>${p.cout.toLocaleString()} FCFA</td>
      <td>${p.conso} L/100km</td>
    `;
    tbody.appendChild(tr);
  });
}

// Mettre à jour le résumé
function mettreAJourResume(pleins) {
  document.getElementById("nbPleins").textContent = pleins.length;

  if (pleins.length === 0) {
    document.getElementById("consoMoyenne").textContent = "0 L/100km";
    document.getElementById("dernierPlein").textContent = "Aucun";
    return;
  }

  // Consommation moyenne (sur les pleins ayant une valeur)
  const consoValues = pleins
    .map(p => parseFloat(p.conso))
    .filter(c => !isNaN(c) && c > 0);

  const consoMoyenne = consoValues.length > 0
    ? (consoValues.reduce((a, b) => a + b, 0) / consoValues.length).toFixed(2)
    : "0";

  document.getElementById("consoMoyenne").textContent = `${consoMoyenne} L/100km`;

  // Dernier plein
  const dernier = pleins[pleins.length - 1];
  document.getElementById("dernierPlein").textContent =
    `${dernier.date} – ${dernier.vehicule} – ${dernier.quantite} L`;
}