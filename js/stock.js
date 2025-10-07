// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  // Charger les données
  const materiels = JSON.parse(localStorage.getItem("materiels")) || [];
  const entrees = JSON.parse(localStorage.getItem("entrees")) || [];
  const sorties = JSON.parse(localStorage.getItem("sorties")) || [];

  // Mettre à jour les listes déroulantes
  mettreAJourSelects();
  // Mettre à jour le tableau
  afficherStocks();
});

// Ajouter un nouvel article
document.getElementById("formMateriel").addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("nomMateriel").value;
  const unite = document.getElementById("unite").value;
  const stock = parseInt(document.getElementById("stockInitial").value);
  const seuil = parseInt(document.getElementById("seuil").value);

  let materiels = JSON.parse(localStorage.getItem("materiels")) || [];

  // Vérifier si l'article existe déjà
  if (materiels.some(m => m.nom === nom)) {
    alert(`⚠️ L'article "${nom}" existe déjà.`);
    return;
  }

  // Ajouter le nouvel article
  materiels.push({ id: Date.now(), nom, unite, stock, seuil });
  localStorage.setItem("materiels", JSON.stringify(materiels));

  // Réinitialiser le formulaire
  this.reset();
  // Mettre à jour l'affichage
  mettreAJourSelects();
  afficherStocks();
});

// Enregistrer une entrée
document.getElementById("formEntree").addEventListener("submit", function (e) {
  e.preventDefault();

  const idMateriel = parseInt(document.getElementById("selectEntree").value);
  const date = document.getElementById("dateEntree").value;
  const fournisseur = document.getElementById("fournisseur").value;
  const quantite = parseInt(document.getElementById("quantiteEntree").value);

  let entrees = JSON.parse(localStorage.getItem("entrees")) || [];
  let materiels = JSON.parse(localStorage.getItem("materiels")) || [];

  // Trouver le matériel
  const materiel = materiels.find(m => m.id === idMateriel);
  if (!materiel) return;

  // Ajouter l'entrée
  entrees.push({ id: Date.now(), idMateriel, date, fournisseur, quantite });
  localStorage.setItem("entrees", JSON.stringify(entrees));

  // Mettre à jour le stock
  materiel.stock += quantite;
  localStorage.setItem("materiels", JSON.stringify(materiels));

  // Réinitialiser
  this.reset();
  afficherStocks();
});

// Enregistrer une sortie
document.getElementById("formSortie").addEventListener("submit", function (e) {
  e.preventDefault();

  const idMateriel = parseInt(document.getElementById("selectSortie").value);
  const date = document.getElementById("dateSortie").value;
  const destinataire = document.getElementById("destinataire").value;
  const motif = document.getElementById("motifSortie").value;
  const quantite = parseInt(document.getElementById("quantiteSortie").value);

  let sorties = JSON.parse(localStorage.getItem("sorties")) || [];
  let materiels = JSON.parse(localStorage.getItem("materiels")) || [];

  const materiel = materiels.find(m => m.id === idMateriel);
  if (!materiel) return;

  if (quantite > materiel.stock) {
    alert(`❌ Stock insuffisant : seulement ${materiel.stock} ${materiel.unite}(s) disponibles.`);
    return;
  }

  // Ajouter la sortie
  sorties.push({ id: Date.now(), idMateriel, date, destinataire, motif, quantite });
  localStorage.setItem("sorties", JSON.stringify(sorties));

  // Mettre à jour le stock
  materiel.stock -= quantite;
  localStorage.setItem("materiels", JSON.stringify(materiels));

  // Réinitialiser
  this.reset();
  afficherStocks();
});

// Mettre à jour les menus déroulants
function mettreAJourSelects() {
  const materiels = JSON.parse(localStorage.getItem("materiels")) || [];
  const selectEntree = document.getElementById("selectEntree");
  const selectSortie = document.getElementById("selectSortie");

  // Vider les selects
  selectEntree.innerHTML = "<option value=''>Choisir un article</option>";
  selectSortie.innerHTML = "<option value=''>Choisir un article</option>";

  materiels.forEach(m => {
    const opt1 = document.createElement("option");
    opt1.value = m.id;
    opt1.textContent = `${m.nom} (${m.stock} ${m.unite})`;
    selectEntree.appendChild(opt1.cloneNode(true));
    selectSortie.appendChild(opt1);
  });
}

// Afficher le tableau des stocks
function afficherStocks() {
  const materiels = JSON.parse(localStorage.getItem("materiels")) || [];
  const tbody = document.querySelector("#tableauStocks tbody");
  tbody.innerHTML = "";

  if (materiels.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Aucun article ajouté.</td></tr>";
    return;
  }

  materiels.forEach(m => {
    const tr = document.createElement("tr");
    const statut = m.stock <= m.seuil ? "⚠️ Attention" : "✅ Normal";
    const couleur = m.stock <= m.seuil ? "color: orange;" : "color: green;";

    tr.innerHTML = `
      <td>${m.nom}</td>
      <td>${m.unite}</td>
      <td>${m.stock}</td>
      <td>${m.seuil}</td>
      <td style="${couleur}">${statut}</td>
    `;
    tbody.appendChild(tr);
  });

  // Mettre à jour les menus
  mettreAJourSelects();
}