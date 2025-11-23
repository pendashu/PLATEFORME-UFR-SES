// Charger tous les stocks depuis le backend
async function chargerStocks() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/stocks");
    if (!response.ok) throw new Error("Erreur réseau");

    const stocks = await response.json();
    afficherStocks(stocks);
  } catch (err) {
    console.error("Erreur lors du chargement des stocks :", err);
    alert("Impossible de charger les stocks.");
  }
}

// Ajouter un nouveau stock via le backend
async function ajouterStock(nom, unite, stock, seuil) {
  const nouveauStock = { nom, unite, stock: parseInt(stock), seuil: parseInt(seuil) };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/stocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nouveauStock)
    });

    if (response.ok) {
      alert("✅ Stock ajouté avec succès !");
      chargerStocks(); // Recharge la liste
    } else {
      alert("❌ Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error("Erreur :", err);
    alert("Impossible d'ajouter le stock.");
  }
}

// Fonction pour afficher les stocks dans le tableau
function afficherStocks(stocks) {
  const tbody = document.querySelector("#tableau-stocks tbody");
  tbody.innerHTML = "";

  if (stocks.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='6'>Aucun stock enregistré.</td>";
    tbody.appendChild(tr);
  } else {
    stocks.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.nom}</td>
        <td>${s.unite}</td>
        <td>${s.stock}</td>
        <td>${s.seuil}</td>
        <td>${s.dateMiseAJour || "-"}</td>
        <td>
          <button onclick="modifierStock('${s._id}')">Modifier</button>
          <button onclick="supprimerStock('${s._id}')">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Supprimer un stock
async function supprimerStock(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce stock ?")) return;

  try {
    const response = await fetch(`https://backend-ufr-ses-i9bo.onrender.com/api/stocks/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      chargerStocks();
    } else {
      alert("❌ Échec de la suppression.");
    }
  } catch (err) {
    console.error("Erreur :", err);
  }
}

// Appel au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  chargerStocks();
  window.ajouterStock = ajouterStock;
  window.supprimerStock = supprimerStock;
});