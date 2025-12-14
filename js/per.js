async function chargerPER() {
  try {
    const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per");
    const pers = await res.json();
    const liste = document.getElementById("listePER");
    liste.innerHTML = pers.length === 0 
      ? "<li>Aucune demande</li>" 
      : pers.map(p => `<li>${p.date} : ${p.objet} (${p.montant.toLocaleString()} FCFA) — ${p.statut}</li>`).join('');
  } catch (err) {
    console.error("Erreur :", err);
    document.getElementById("listePER").innerHTML = "<li>⚠️ Impossible de charger les PER.</li>";
  }
}

document.getElementById("formPER")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    demandeur: document.getElementById("demandeur").value,
    service: document.getElementById("service").value,
    objet: document.getElementById("objet").value,
    montant: parseFloat(document.getElementById("montant").value),
    date: document.getElementById("date").value,
    statut: "en attente"
  };
  try {
    await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert("✅ PER soumis !");
    chargerPER();
  } catch (err) {
    alert("❌ Erreur lors de la soumission.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
  }
  chargerPER();
});