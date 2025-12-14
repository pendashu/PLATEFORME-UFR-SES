// dashboard.js — Tableau de bord principal

async function chargerDashboard() {
  try {
    const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/dashboard");
    const data = await res.json();
    
    // Met à jour les stats
    document.getElementById("total-budget").textContent = 
      data.resume.totalBudget ? data.resume.totalBudget.toLocaleString() + " FCFA" : "0 FCFA";
    document.getElementById("total-depenses").textContent = 
      data.resume.totalDepenses ? data.resume.totalDepenses.toLocaleString() + " FCFA" : "0 FCFA";
    document.getElementById("solde").textContent = 
      data.resume.solde ? data.resume.solde.toLocaleString() + " FCFA" : "0 FCFA";
    document.getElementById("per-en-attente").textContent = data.resume.perEnAttente;
    document.getElementById("stocks-critiques").textContent = data.resume.stocksCritiques;
    document.getElementById("consommation-moyenne").textContent = 
      data.resume.consommationMoyenne ? data.resume.consommationMoyenne + " L" : "—";

    // Mise à jour des couleurs selon l'état
    const soldeEl = document.getElementById("solde");
    if (data.resume.solde < 0) {
      soldeEl.style.color = "red";
      soldeEl.textContent += " (Dépassement)";
    } else if (data.resume.solde < data.resume.totalBudget * 0.2) {
      soldeEl.style.color = "orange";
      soldeEl.textContent += " (Attention)";
    } else {
      soldeEl.style.color = "green";
      soldeEl.textContent += " (Normal)";
    }

  } catch (err) {
    console.error("Erreur dashboard :", err);
    alert("⚠️ Impossible de charger le tableau de bord.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("welcomeName").textContent = user.name;
  }
  chargerDashboard();

  // Rafraîchissement toutes les 30 secondes
  setInterval(chargerDashboard, 30000);
});