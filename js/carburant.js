async function chargerPleins() {
  try {
    const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/carburant");
    const pleins = await res.json();
    const liste = document.getElementById("listePleins");
    liste.innerHTML = pleins.length === 0 
      ? "<li>Aucun plein</li>" 
      : pleins.map(p => `<li>${p.date} — ${p.vehicule} (${p.quantite} L, ${p.cout.toLocaleString()} FCFA)</li>`).join('');
  } catch (err) {
    console.error("Erreur :", err);
    document.getElementById("listePleins").innerHTML = "<li>⚠️ Impossible de charger les pleins.</li>";
  }
}

document.getElementById("formCarburant")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    date: document.getElementById("date").value,
    vehicule: document.getElementById("vehicule").value,
    conducteur: document.getElementById("conducteur").value,
    kilometrage: parseInt(document.getElementById("kilometrage").value),
    quantite: parseFloat(document.getElementById("quantite").value),
    cout: parseInt(document.getElementById("cout").value)
  };
  try {
    await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/carburant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert("✅ Plein enregistré !");
    chargerPleins();
  } catch (err) {
    alert("❌ Erreur lors de l'enregistrement.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "comptable_matiere") {
    alert("accès réservé au comptable matière");
    window.location.href = "index.html";
  }
  chargerPleins();
});