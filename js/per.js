// Fonction pour vérifier l'utilisateur connecté
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("❌ Vous n'êtes pas connecté.");
    window.location.href = "index.html";
    return null;
  }
  return user;
}

// Charger les PER depuis le backend
async function chargerPER() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per");
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const pers = await response.json();
    afficherPER(pers);
  } catch (err) {
    console.error("Erreur lors du chargement des PER :", err);
    alert("Impossible de charger les expressions de besoin. Vérifiez votre connexion.");
  }
}

// Afficher les PER dans le tableau
function afficherPER(pers) {
  const tbody = document.querySelector("#tableau-per tbody");
  tbody.innerHTML = "";

  if (pers.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='7'>Aucune demande enregistrée.</td>";
    tbody.appendChild(tr);
  } else {
    pers.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.demandeur || '-'}</td>
        <td>${p.service || '-'}</td>
        <td>${p.objet || '-'}</td>
        <td>${p.montant ? p.montant.toLocaleString() + ' FCFA' : '-'}</td>
        <td>${p.date || '-'}</td>
        <td><span class="statut ${p.statut?.toLowerCase() || ''}">${p.statut || 'Non défini'}</span></td>
        <td><button onclick="supprimerPER('${p._id}')">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Ajouter un nouveau PER
async function ajouterPER(demandeur, service, objet, montant, date, statut = 'en attente') {
  const nouveauPER = { demandeur, service, objet, montant: parseFloat(montant), date, statut };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nouveauPER)
    });

    if (response.ok) {
      alert("✅ Expression de besoin ajoutée avec succès !");
      document.getElementById("form-per").reset(); // Réinitialise le formulaire
      chargerPER(); // Recharge la liste
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(`❌ Échec de l'ajout : ${errorData.error || 'Erreur inconnue'}`);
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    alert("❌ Impossible de se connecter au serveur. Vérifiez votre connexion.");
  }
}

// Supprimer un PER
async function supprimerPER(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette expression de besoin ?")) return;

  try {
    const response = await fetch(`https://backend-ufr-ses-i9bo.onrender.com/api/per/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("🗑️ Demande supprimée avec succès !");
      chargerPER(); // Recharge la liste
    } else {
      alert("❌ Échec de la suppression.");
    }
  } catch (err) {
    console.error("Erreur :", err);
    alert("Impossible de supprimer la demande.");
  }
}

// Gestion des rôles au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuth();
  if (!user) return;

  // Rôles autorisés à accéder au module PER
  const rolesAutorises = ["comptable_matiere", "enseignant", "PATS", "PAS", "directeur_ufr"];
  
  if (!rolesAutorises.includes(user.role)) {
    alert("❌ Accès refusé : vous n'êtes pas autorisé à accéder au module PER.");
    window.location.href = "dashboard.html";
    return;
  }

  // Afficher ou cacher le formulaire selon le rôle
  if (["comptable_matiere", "enseignant", "PATS", "PAS"].includes(user.role)) {
    document.getElementById("form-per").style.display = "block";
  } else {
    document.getElementById("form-per").style.display = "none";
  }

  // Charger les données
  chargerPER();

  // Exposer les fonctions globalement pour les boutons HTML
  window.ajouterPER = (demandeur, service, objet, montant, date) => {
    ajouterPER(demandeur, service, objet, montant, date);
  };
  window.supprimerPER = supprimerPER;
});