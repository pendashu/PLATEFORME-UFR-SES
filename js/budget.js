<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", async () => {
  const user = checkAuth();
  if (!user) return;

  const role = user.role;
  if (role !== "comptable_finance") {
    alert("❌ Accès refusé : uniquement pour le comptable finance.");
    window.location.href = "index.html";
    return;
  }

=======
document.addEventListener("DOMContentLoaded", function () {
  const depenses = JSON.parse(localStorage.getItem("depenses")) || [];
>>>>>>> 6ea4c374a12b514e2eb442d07f5c1db21f41fec0
  const listeDepenses = document.getElementById("listeDepenses");
  const depensesEl = document.getElementById("depenses");
  const soldeEl = document.getElementById("solde");
  const statutEl = document.getElementById("statut");

<<<<<<< HEAD
  // Montant total du budget (fixe)
  const budgetTotal = 1500000; // Tu peux aussi le charger depuis une API plus tard

  let depenses = [];

  // 🔹 Charger les dépenses depuis le backend
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/budget");
    if (response.ok) {
      depenses = await response.json();
    } else {
      throw new Error("Impossible de charger les données");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("Impossible de se connecter au serveur.");
    depenses = []; // Continue avec une liste vide
  }

  // 🔹 Calculer les totaux
  const totalDepenses = depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const solde = budgetTotal - totalDepenses;

  // 🔹 Afficher les totaux
=======
  const budgetTotal = parseFloat(localStorage.getItem("budgetTotal")) || 1500000;
  const totalDepenses = depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const solde = budgetTotal - totalDepenses;

  // Afficher les totaux
>>>>>>> 6ea4c374a12b514e2eb442d07f5c1db21f41fec0
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

<<<<<<< HEAD
  // 🔹 Afficher l'historique
=======
  // Afficher l'historique
>>>>>>> 6ea4c374a12b514e2eb442d07f5c1db21f41fec0
  listeDepenses.innerHTML = "";
  if (depenses.length === 0) {
    listeDepenses.innerHTML = "<li>Aucune dépense enregistrée.</li>";
  } else {
    depenses.forEach(d => {
      const li = document.createElement("li");
<<<<<<< HEAD
      li.textContent = `${d.date} : ${d.motif} – ${parseFloat(d.montant).toLocaleString()} FCFA`;
      listeDepenses.appendChild(li);
    });
  }

  // 🔹 Fonction pour ajouter une nouvelle dépense
  window.ajouterDepense = async function(motif, montant, date) {
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
        location.reload(); // Recharge pour afficher la nouvelle donnée
      } else {
        alert("❌ Erreur lors de l'ajout.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      alert("Impossible de se connecter au serveur.");
    }
  };
});
=======
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
>>>>>>> 6ea4c374a12b514e2eb442d07f5c1db21f41fec0
