// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  const operations = JSON.parse(localStorage.getItem("passation")) || [];
  afficherOperations(operations);
});

// Ajouter une nouvelle opération
document.getElementById("formPassation").addEventListener("submit", function (e) {
  e.preventDefault();

  const ref = document.getElementById("ref").value;
  const objet = document.getElementById("objet").value;
  const dateBesoin = document.getElementById("dateBesoin").value;
  const budgetEstime = parseInt(document.getElementById("budgetEstime").value);

  // Récupérer les opérations existantes
  let operations = JSON.parse(localStorage.getItem("passation")) || [];

  // Vérifier si la référence existe déjà
  if (operations.some(op => op.ref === ref)) {
    alert(`⚠️ Une opération avec la référence "${ref}" existe déjà.`);
    return;
  }

  // Ajouter la nouvelle opération
  operations.push({
    ref,
    objet,
    dates: {
      besoin: dateBesoin,
      consultation: "",
      adjudication: "",
      livraison: "",
      paiement: ""
    },
    observation: { consultation: "", adjudication: "", livraison: "", paiement: "" },
    budgetEstime
  });

  // Sauvegarder
  localStorage.setItem("passation", JSON.stringify(operations));

  // Mettre à jour l'affichage
  afficherOperations(operations);

  // Réinitialiser le formulaire
  this.reset();
});

// Afficher toutes les opérations
function afficherOperations(operations) {
  const tbody = document.querySelector("#tableauPassation tbody");
  tbody.innerHTML = "";

  if (operations.length === 0) {
    tbody.innerHTML = "<tr><td colspan='8'>Aucune opération enregistrée.</td></tr>";
    return;
  }

  operations.forEach((op, index) => {
    const tr = document.createElement("tr");
    tr.dataset.index = index;

    // Générer les cellules pour chaque étape
    let statut = "En cours";
    let statutClass = "ok";

    const consultation = op.dates.consultation ? `<strong>${op.dates.consultation}</strong>` : '<span style="color:#999">–</span>';
    const adjudication = op.dates.adjudication ? `<strong>${op.dates.adjudication}</strong>` : '<span style="color:#999">–</span>';
    const livraison = op.dates.livraison ? `<strong>${op.dates.livraison}</strong>` : '<span style="color:#999">–</span>';
    const paiement = op.dates.paiement ? `<strong>${op.dates.paiement}</strong>` : '<span style="color:#999">–</span>';

    // Déterminer le statut global
    if (op.dates.paiement) {
      statut = "✅ Terminé";
      statutClass = "ok";
    } else if (op.dates.livraison) {
      statut = "🔄 Paiement en cours";
      statutClass = "alert";
    } else if (op.dates.adjudication) {
      statut = "🚚 Livraison prévue";
      statutClass = "ok";
    } else if (op.dates.consultation) {
      statut = "📩 En adjudication";
      statutClass = "ok";
    } else {
      statut = "📩 Consultation en cours";
      statutClass = "ok";
    }

    tr.innerHTML = `
      <td><strong>${op.ref}</strong></td>
      <td>${op.objet}</td>
      <td>${op.dates.besoin}</td>
      <td class="clickable">${consultation}</td>
      <td class="clickable">${adjudication}</td>
      <td class="clickable">${livraison}</td>
      <td class="clickable">${paiement}</td>
      <td class="${statutClass}"><strong>${statut}</strong></td>
    `;
    tbody.appendChild(tr);
  });

  // Ajouter les événements de clic sur les cellules cliquables
  document.querySelectorAll(".clickable").forEach(cell => {
    cell.addEventListener("click", function () {
      const row = this.closest("tr");
      const index = row.dataset.index;
      const col = this.cellIndex;

      let etape = "";
      if (col === 4) etape = "consultation";
      else if (col === 5) etape = "adjudication";
      else if (col === 6) etape = "livraison";
      else if (col === 7) etape = "paiement";
      else return;

      // Charger les données
      const operations = JSON.parse(localStorage.getItem("passation")) || [];
      const op = operations[index];

      if (op.dates[etape]) {
        alert(`Étape déjà complétée le ${op.dates[etape]}`);
        return;
      }

      // Afficher le panneau de mise à jour
      document.getElementById("detailObjet").textContent = op.objet;
      document.getElementById("etape").value = etape;
      document.getElementById("sectionDetail").style.display = "block";
      document.getElementById("formMiseAJour").dataset.index = index;
      document.getElementById("formMiseAJour").dataset.etape = etape;
    });
  });
}

// Gérer la mise à jour
document.getElementById("formMiseAJour").addEventListener("submit", function (e) {
  e.preventDefault();

  const index = this.dataset.index;
  const etape = this.dataset.etape;
  const date = document.getElementById("dateUpdate").value;
  const observation = document.getElementById("observation").value;

  let operations = JSON.parse(localStorage.getItem("passation")) || [];
  operations[index].dates[etape] = date;
  operations[index].observation[etape] = observation;

  localStorage.setItem("passation", JSON.stringify(operations));

  // Masquer le panneau
  document.getElementById("sectionDetail").style.display = "none";
  this.reset();

  // Rafraîchir l'affichage
  afficherOperations(operations);
});

// Annuler la mise à jour
document.getElementById("annulerUpdate").addEventListener("click", function () {
  document.getElementById("sectionDetail").style.display = "none";
  document.getElementById("formMiseAJour").reset();
});