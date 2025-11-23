// Charger les dépenses depuis le backend
async function chargerDepenses() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/budget");
    if (!response.ok) throw new Error("Erreur réseau");

    const depenses = await response.json();
    afficherDepenses(depenses);
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
    alert("Impossible de charger les données. Vérifiez votre connexion.");
  }
}

// Ajouter une nouvelle dépense via le backend
async function ajouterDepense(motif, montant, date) {
  const nouvelleDepense = { motif, montant: parseFloat(montant), date };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nouvelleDepense)
    });

    if (response.ok) {
      alert("✅ Dépense ajoutée avec succès !");
      chargerDepenses(); // Recharge la liste
    } else {
      alert("❌ Erreur lors de l'ajout.");
    }
  } catch (err) {
    console.error("Erreur :", err);
    alert("Impossible d'ajouter la dépense.");
  }
}

// Fonction pour afficher les dépenses dans le tableau
function afficherDepenses(depenses) {
  const listeDepenses = document.getElementById("listeDepenses");
  const depensesEl = document.getElementById("depenses");
  const soldeEl = document.getElementById("solde");
  const statutEl = document.getElementById("statut");

  // Budget total fixe (peut être dynamique plus tard)
  const budgetTotal = 1500000;
  const totalDepenses = depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const solde = budgetTotal - totalDepenses;

  // Afficher les totaux
  depensesEl.textContent = `${totalDepenses.toLocaleString()} FCFA`;
  soldeEl.textContent = `${solde.toLocaleString()} FCFA`;

  // Statut
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
      li.textContent = `${d.date} : ${d.motif} – ${parseFloat(d.montant).toLocaleString()} FCFA`;
      listeDepenses.appendChild(li);
    });
  }
}

// Appel au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  chargerDepenses();

  // Exemple : si tu as un bouton "Ajouter"
  window.ajouterDepense = ajouterDepense;
});
// Fonction pour vérifier l'utilisateur connecté
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}