// === FONCTIONS D'EXPORT ===

function exporterDonnees() {
  const data = {
    meta: { date: new Date().toISOString(), version: "1.0" },
    depenses: JSON.parse(localStorage.getItem("depenses")) || [],
    perListe: JSON.parse(localStorage.getItem("perListe")) || [],
    materiels: JSON.parse(localStorage.getItem("materiels")) || [],
    entrees: JSON.parse(localStorage.getItem("entrees")) || [],
    sorties: JSON.parse(localStorage.getItem("sorties")) || [],
    pleins: JSON.parse(localStorage.getItem("pleins")) || [],
    passation: JSON.parse(localStorage.getItem("passation")) || []
  };

  const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement('a');
  a.href = 'data:' + dataStr;
  a.download = "SAUVEGARDE_UFR_SES_" + new Date().toISOString().split('T')[0] + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importerDonnees(fichier) {
  const lecteur = new FileReader();
  lecteur.onload = function(e) {
    const data = JSON.parse(e.target.result);
    for (const [key, value] of Object.entries(data)) {
      if (key !== "meta") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    alert("✅ Données restaurées !");
    location.reload();
  };
  lecteur.readAsText(fichier);
}

function exporterEnPDF() {
  if (typeof window.jspdf === 'undefined') return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Rapport PER - UFR SES", 10, 10);

  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  let y = 30;
  perListe.forEach(p => {
    doc.text(`${p.objet} – ${p.montant} FCFA (${p.demandeur})`, 10, y);
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("Rapport_PER.pdf");
}

function exporterEnExcel() {
  if (typeof XLSX === 'undefined') return;

  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  const ws = XLSX.utils.json_to_sheet(perListe);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "PER");
  XLSX.writeFile(wb, "PER_UFR_SES.xlsx");
}
// URL de ton backend Render
const API_URL = "https://backend-ufr-ses-i9bo.onrender.com";

// Exemple : récupérer toutes les "pers" (ou PER)
async function getPer() {
  try {
    const response = await fetch(`${API_URL}/api/per`);
    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }
    const data = await response.json();
    console.log("Données PER :", data);
    displayPers(data); // fonction pour afficher les données dans ta page
  } catch (err) {
    console.error("Erreur lors du fetch PER :", err);
  }
}

function displayPers(pers) {
  const container = document.getElementById("pers-list");
  if (!container) return;

  // vide l'ancien contenu
  container.innerHTML = "";

  pers.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `Nom : ${p.nom}, Prénom : ${p.prenom}, Id : ${p._id}`;
    container.appendChild(div);
  });
}

// Appel la fonction quand la page charge
window.addEventListener("DOMContentLoaded", () => {
  getPer();
});
