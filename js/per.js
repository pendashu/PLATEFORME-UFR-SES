// Chargement au démarrage
document.addEventListener("DOMContentLoaded", function () {
  // Charger les PER sauvegardés
  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  afficherPER(perListe);
});

// Gérer la soumission du formulaire
document.getElementById("formPER").addEventListener("submit", function (e) {
  e.preventDefault();

  // Récupérer les données
  const demandeur = document.getElementById("demandeur").value;
  const service = document.getElementById("service").value;
  const objet = document.getElementById("objet").value;
  const montant = parseFloat(document.getElementById("montant").value);
  const date = new Date().toLocaleDateString("fr-MA");

  // Vérifier le seuil
  const SEUIL = 500000;
  const alerteDiv = document.getElementById("alerte");

  if (montant > SEUIL) {
    alerteDiv.innerHTML = `<p style="color: orange;">⚠️ Alerte : Ce besoin dépasse ${SEUIL.toLocaleString()} FCFA. Validation du directeur requise.</p>`;
  } else {
    alerteDiv.innerHTML = `<p style="color: green;">✅ Demande enregistrée. Montant inférieur au seuil.</p>`;
  }

  // Sauvegarder la demande
  let perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  perListe.push({ demandeur, service, objet, montant, date, statut: "En attente" });
  localStorage.setItem("perListe", JSON.stringify(perListe));

  // Mettre à jour l'affichage
  afficherPER(perListe);

  // Réinitialiser le formulaire
  this.reset();
  setTimeout(() => {
    alerteDiv.innerHTML = "";
  }, 3000);
});

// Fonction pour afficher la liste des PER
function afficherPER(liste) {
  const ul = document.getElementById("listePER");
  if (liste.length === 0) {
    ul.innerHTML = "<li>Aucune demande enregistrée.</li>";
  } else {
    ul.innerHTML = "";
    liste.forEach((p, i) => {
      const li = document.createElement("li");
      li.style.padding = "8px";
      li.style.margin = "5px 0";
      li.style.borderBottom = "1px solid #eee";
      li.innerHTML = `
        <strong>${p.date}</strong><br>
        ${p.demandeur} (${p.service})<br>
        <em>${p.objet}</em><br>
        <span style="color: ${p.montant > 500000 ? 'orange' : 'green'};">
          ${p.montant.toLocaleString()} FCFA
        </span>
      `;
      ul.appendChild(li);
    });
  }
}