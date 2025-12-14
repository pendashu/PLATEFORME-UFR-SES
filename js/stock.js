async function chargerStocks() {
  try {
    const res = await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/stocks");
    const stocks = await res.json();
    const liste = document.getElementById("listeStocks");
    liste.innerHTML = stocks.length === 0 
      ? "<li>Aucun stock</li>" 
      : stocks.map(s => `<li>${s.nom} : ${s.stock}/${s.seuil} ${s.unite} 
          <span ${s.stock <= s.seuil ? "style='color:red'" : ""}>${s.stock <= s.seuil ? "⚠️" : "✅"}</span>
        </li>`).join('');
  } catch (err) {
    console.error("Erreur :", err);
    document.getElementById("listeStocks").innerHTML = "<li>⚠️ Impossible de charger les stocks.</li>";
  }
}

document.getElementById("formStock")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nom: document.getElementById("nom").value,
    unite: document.getElementById("unite").value,
    stock: parseInt(document.getElementById("stock").value),
    seuil: parseInt(document.getElementById("seuil").value)
  };
  try {
    await fetch("https://backend-ufr-ses-i9bo.onrender.com/api/stocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert("✅ Stock ajouté !");
    chargerStocks();
  } catch (err) {
    alert("❌ Erreur lors de l'ajout.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "comptable_matiere") {
    alert("accès réservé au comptable matière");
    window.location.href = "index.html";
  }
  chargerStocks();
});