document.addEventListener("DOMContentLoaded", function () {
  const pleins = JSON.parse(localStorage.getItem("pleins")) || [];
  const tableauPleins = document.getElementById("tableauPleins").querySelector("tbody");

  // Afficher les pleins
  tableauPleins.innerHTML = "";
  if (pleins.length === 0) {
    tableauPleins.innerHTML = "<tr><td colspan='7'>Aucun plein enregistré.</td></tr>";
  } else {
    pleins.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.date}</td>
        <td>${p.vehicule}</td>
        <td>${p.conducteur}</td>
        <td>${p.kilometrage}</td>
        <td>${p.quantite} L</td>
        <td>${p.cout} FCFA</td>
        <td>8.2 L/100km</td>
      `;
      tableauPleins.appendChild(tr);
    });
  }

  // Formulaire (si présent)
  const form = document.getElementById("formCarburant");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const nouveau = {
        date: document.getElementById("datePlein").value,
        vehicule: document.getElementById("vehicule").value,
        conducteur: document.getElementById("conducteur").value,
        kilometrage: document.getElementById("kilometrage").value,
        quantite: document.getElementById("quantite").value,
        cout: document.getElementById("cout").value
      };

      pleins.push(nouveau);
      localStorage.setItem("pleins", JSON.stringify(pleins));

      form.reset();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nouveau.date}</td>
        <td>${nouveau.vehicule}</td>
        <td>${nouveau.conducteur}</td>
        <td>${nouveau.kilometrage}</td>
        <td>${nouveau.quantite} L</td>
        <td>${nouveau.cout} FCFA</td>
        <td>8.2 L/100km</td>
      `;
      tableauPleins.appendChild(tr);
    });
  }
});
const role = user.role;
if (user.role !== "comptable_matiere") {
  alert("❌ Accès refusé : uniquement pour le comptable matière.");
  window.location.href = "index.html";
}