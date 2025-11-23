// Charger tous les pleins depuis le backend
async function chargerPleins() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/carburant");
    if (!response.ok) throw new Error("Erreur réseau");

    const pleins = await response.json();
    afficherPleins(pleins);
  } catch (err) {
    console.error("Erreur lors du chargement des pleins :", err);
    alert("Impossible de charger les données carburant.");
  }
}

// Ajouter un nouveau plein
async function ajouterPlein(date, vehicule, conducteur, kilometrage, quantite, cout) {
  const nouveauPlein = { date, vehicule, conducteur, kilometrage: parseInt(kilometrage), quantite: parseFloat(quantite), cout: parseInt(cout) };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/carburant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nouveauPlein)
    });

    if (response.ok) {
      alert("✅ Plein ajouté avec succès !");
      chargerPleins();
    } else {
      alert("❌ Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error("Erreur :", err);
  }
}

// Afficher les pleins dans le tableau
function afficherPleins(pleins) {
  const tbody = document.querySelector("#tableau-carburant tbody");
  tbody.innerHTML = "";

  if (pleins.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='7'>Aucun plein enregistré.</td>";
    tbody.appendChild(tr);
  } else {
    pleins.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.date}</td>
        <td>${p.vehicule}</td>
        <td>${p.conducteur}</td>
        <td>${p.kilometrage}</td>
        <td>${p.quantite} L</td>
        <td>${p.cout.toLocaleString()} FCFA</td>
        <td><button onclick="supprimerPlein('${p._id}')">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Supprimer un plein
async function supprimerPlein(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce plein ?")) return;

  try {
    const response = await fetch(`https://backend-ufr-ses-i9bo.onrender.com/api/carburant/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      chargerPleins();
    } else {
      alert("❌ Échec de la suppression.");
    }
  } catch (err) {
    console.error("Erreur :", err);
  }
}

// Au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  chargerPleins();
  window.ajouterPlein = ajouterPlein;
  window.supprimerPlein = supprimerPlein;
});