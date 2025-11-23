// Charger tous les plans de passation
async function chargerPassations() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/passation");
    if (!response.ok) throw new Error("Erreur réseau");

    const passations = await response.json();
    afficherPassations(passations);
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
    alert("Impossible de charger le plan de passation.");
  }
}

// Ajouter un nouveau lot
async function ajouterPassation(lot, objet, typeMarche, montantEstime, procedurePassation, trimestre, annee, statut) {
  const nouvellePassation = {
    lot,
    objet,
    typeMarche,
    montantEstime: parseInt(montantEstime),
    procedurePassation,
    trimestre,
    annee: parseInt(annee),
    statut: statut || "En préparation"
  };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/passation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nouvellePassation)
    });

    if (response.ok) {
      alert("✅ Lot ajouté avec succès !");
      chargerPassations();
    } else {
      alert("❌ Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error("Erreur :", err);
  }
}

// Afficher les lots
function afficherPassations(passations) {
  const tbody = document.querySelector("#tableau-passation tbody");
  tbody.innerHTML = "";

  if (passations.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='9'>Aucun lot enregistré.</td>";
    tbody.appendChild(tr);
  } else {
    passations.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.lot}</td>
        <td>${p.objet}</td>
        <td>${p.typeMarche}</td>
        <td>${p.montantEstime.toLocaleString()}</td>
        <td>${p.procedurePassation}</td>
        <td>${p.trimestre}</td>
        <td>${p.annee}</td>
        <td>${p.statut}</td>
        <td><button onclick="supprimerPassation('${p._id}')">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Supprimer un lot
async function supprimerPassation(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce lot ?")) return;

  try {
    const response = await fetch(`https://backend-ufr-ses-i9bo.onrender.com/api/passation/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      chargerPassations();
    } else {
      alert("❌ Échec de la suppression.");
    }
  } catch (err) {
    console.error("Erreur :", err);
  }
}

// Au chargement
document.addEventListener("DOMContentLoaded", () => {
  chargerPassations();
  window.ajouterPassation = ajouterPassation;
  window.supprimerPassation = supprimerPassation;
});