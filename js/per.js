document.addEventListener("DOMContentLoaded", function () {
  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  const listePER = document.getElementById("listePER");

  // Afficher la liste des PER
  listePER.innerHTML = "";
  if (perListe.length === 0) {
    listePER.innerHTML = "<li>Aucun PER enregistré.</li>";
  } else {
    perListe.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.date} | ${p.demandeur} (${p.service}) : ${p.objet} → ${p.montant} FCFA`;
      listePER.appendChild(li);
    });
  }

  // Gestion du formulaire (si présent)
  const form = document.getElementById("formPER");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const newPer = {
        date: document.getElementById("date").value || new Date().toISOString().split('T')[0],
        demandeur: document.getElementById("demandeur").value,
        service: document.getElementById("service").value,
        objet: document.getElementById("objet").value,
        montant: parseFloat(document.getElementById("montant").value)
      };

      perListe.push(newPer);
      localStorage.setItem("perListe", JSON.stringify(perListe));
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Rafraîchir l'affichage
      const li = document.createElement("li");
      li.textContent = `${newPer.date} | ${newPer.demandeur} (${newPer.service}) : ${newPer.objet} → ${newPer.montant} FCFA`;
      listePER.appendChild(li);
    });
  }
});
const role = user.role;


if (user.role !== "comptable_finance") {
  alert("❌ Accès refusé : uniquement pour le comptable finance.");
  window.location.href = "index.html";
}