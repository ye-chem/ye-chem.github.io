/* ================= TIME ================= */
function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();
/* ================= BATTERY ================= */
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    function updateBattery() {
      document.getElementById("battery").textContent =
        Math.round(battery.level * 100) + "%";
    }
    updateBattery();
    battery.addEventListener("levelchange", updateBattery);
  });
}
/* ================= BACKGROUND: STAR ================= */
const bg = document.getElementById("background");
function loadStarBackground() {
  bg.innerHTML = "";
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.width = Math.random() * 3 + 1 + "px";
    star.style.height = star.style.width;
    star.style.background = "white";
    star.style.borderRadius = "50%";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    bg.appendChild(star);
  }
}
loadStarBackground();
/* ================= GAMES ================= */
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let games = [
  { name: "Nebula Run", popular: true, newest: false },
  { name: "Pixel Drift", popular: false, newest: true },
  { name: "Void Jumper", popular: true, newest: true }
];
let currentGames = [...games];
function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilter();
}
function renderGames(list) {
  const grid = document.querySelector(".games-grid");
  if (!grid) return;
  grid.innerHTML = "";
  list.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    const star = document.createElement("div");
    star.className = "favorite";
    star.innerHTML = "star";
    if (favorites.includes(game.name)) star.classList.add("active");
    star.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(game.name);
    };
    const name = document.createElement("div");
    name.className = "game-name";
    name.textContent = game.name;
    card.appendChild(star);
    card.appendChild(name);
    grid.appendChild(card);
  });
}
function applyFilter() {
  const filter = document.getElementById("filterSelect");
  let filtered = [...currentGames];
  if (filter) {
    switch (filter.value) {
      case "az":
        filtered.sort((a,b)=>a.name.localeCompare(b.name));
        break;
      case "za":
        filtered.sort((a,b)=>b.name.localeCompare(a.name));
        break;
      case "popular":
        filtered = filtered.filter(g=>g.popular);
        break;
      case "newest":
        filtered = filtered.filter(g=>g.newest);
        break;
      case "favorited":
        filtered = filtered.filter(g=>favorites.includes(g.name));
        break;
    }
  }
  renderGames(filtered);
}
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    currentGames = games.filter(g =>
      g.name.toLowerCase().includes(term)
    );
    applyFilter();
  });
}
const filterSelect = document.getElementById("filterSelect");
if (filterSelect) {
  filterSelect.addEventListener("change", applyFilter);
}
renderGames(currentGames);

