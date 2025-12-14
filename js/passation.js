async function chargerPassations() {
  try {
    const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/passation");
    const passations = await res.json();
    const tbody = document.querySelector("#tableauPassation tbody");
    tbody.innerHTML = passations.length === 0 
      ? "<tr><td colspan='7'>Aucun lot prévu</td></tr>" 
      : passations.map(p => `
        <tr>
          <td>${p.lot}</td>
          <td>${p.objet}</td>
          <td>${p.typeMarche}</td>
          <td>${p.montantEstime.toLocaleString()}</td>
          <td>${p.procedurePassation}</td>
          <td>${p.trimestre}</td>
          <td>${p.annee}</td>
        </tr>
      `).join('');
  } catch (err) {
    console.error("Erreur :", err);
    document.querySelector("#tableauPassation tbody").innerHTML = 
      "<tr><td colspan='7'>⚠️ Impossible de charger le plan.</td></tr>";
  }
}

document.getElementById("formPassation")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    lot: document.getElementById("lot").value,
    objet: document.getElementById("objet").value,
    typeMarche: document.getElementById("typeMarche").value,
    montantEstime: parseInt(document.getElementById("montantEstime").value),
    procedurePassation: document.getElementById("procedurePassation").value,
    trimestre: document.getElementById("trimestre").value,
    annee: parseInt(document.getElementById("annee").value)
  };
  try {
    await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/passation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert("✅ Lot ajouté !");
    chargerPassations();
  } catch (err) {
    alert("❌ Erreur lors de l'ajout.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || (user.role !== "comptable_finance" && user.role !== "directeur_ufr")) {
    alert("accès réservé au comptable finance ou au directeur");
    window.location.href = "index.html";
  }
  chargerPassations();
});