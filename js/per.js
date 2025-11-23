// Charger les PER depuis le backend
async function chargerPER() {
  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per");
    const pers = await response.json();
    afficherPER(pers);
  } catch (err) {
    console.error("Erreur:", err);
  }
}

// Ajouter un nouveau PER
async function ajouterPER(demandeur, service, objet, montant, date, statut) {
  const nouveauPER = { demandeur, service, objet, montant, date, statut };

  try {
    const response = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/per", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouveauPER)
    });

    if (response.ok) {
      chargerPER(); // Recharge
    }
  } catch (err) {
    console.error("Erreur:", err);
  }
}