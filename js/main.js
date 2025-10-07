// ========================
// FONCTION EXPORT PDF
// ========================
function exporterEnPDF() {
  // Vérifie que jsPDF est chargé
  if (typeof window.jspdf === 'undefined') {
    alert("❌ Erreur : jsPDF n'est pas chargé.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Expression de Besoins (PER)", 10, 10);

  doc.setFontSize(12);
  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];
  let y = 30;

  if (perListe.length === 0) {
    doc.text("Aucun PER enregistré.", 10, y);
  } else {
    perListe.forEach((p, i) => {
      const line = `${i + 1}. ${p.objet} – ${p.montant.toLocaleString()} FCFA (${p.demandeur})`;
      doc.text(line, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  doc.save("Rapport_PER_UFR_SES.pdf");
}

// ========================
// FONCTION EXPORT EXCEL
// ========================
function exporterEnExcel() {
  // Vérifie que SheetJS est chargé
  if (typeof XLSX === 'undefined') {
    alert("❌ Erreur : SheetJS (xlsx) n'est pas chargé.");
    return;
  }

  const perListe = JSON.parse(localStorage.getItem("perListe")) || [];

  const data = perListe.map(p => ({
    "Date": p.date,
    "Demandeur": p.demandeur,
    "Service": p.service,
    "Objet": p.objet,
    "Montant (FCFA)": p.montant,
    "Statut": p.montant > 500000 ? "À valider" : "OK"
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "PER");

  XLSX.writeFile(wb, "Données_PER_UFR_SES.xlsx");
}