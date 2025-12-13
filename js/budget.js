// Charger les dépenses depuis Render
async function chargerDepenses() {
  const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/budget");
  const depenses = await res.json();
  afficherDepenses(depenses);
}

// Soumettre une nouvelle dépense
document.getElementById("formBudget")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    motif: document.getElementById("motif").value,
    montant: parseFloat(document.getElementById("montant").value),
    date: document.getElementById("date").value
  };
  await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/budget", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  chargerDepenses(); // Recharge la liste
});