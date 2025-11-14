document.addEventListener("DOMContentLoaded", function () {
  const materiels = JSON.parse(localStorage.getItem("materiels")) || [];
  const listeMateriels = document.getElementById("listeMateriels");

  // Afficher les stocks
  listeMateriels.innerHTML = "";
  if (materiels.length === 0) {
    listeMateriels.innerHTML = "<li>Aucun article en stock.</li>";
  } else {
    materiels.forEach(m => {
      const li = document.createElement("li");
      const statut = m.stock <= m.seuil ? "⚠️" : "✅";
      li.textContent = `${statut} ${m.nom} : ${m.stock} ${m.unite} (seuil: ${m.seuil})`;
      listeMateriels.appendChild(li);
    });
  }

  // Formulaire d'ajout (si présent)
  const form = document.getElementById("formStock");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const nouveau = {
        nom: document.getElementById("nom").value,
        unite: document.getElementById("unite").value,
        stock: parseInt(document.getElementById("stock").value),
        seuil: parseInt(document.getElementById("seuil").value)
      };

      materiels.push(nouveau);
      localStorage.setItem("materiels", JSON.stringify(materiels));

      form.reset();

      const li = document.createElement("li");
      const statut = nouveau.stock <= nouveau.seuil ? "⚠️" : "✅";
      li.textContent = `${statut} ${nouveau.nom} : ${nouveau.stock} ${nouveau.unite}`;
      listeMateriels.appendChild(li);
    });
  }
});
const role = user.role;
if (user.role !== "comptable_matiere") {
  alert("❌ Accès refusé : uniquement pour le comptable matière.");
  window.location.href = "index.html";
}

