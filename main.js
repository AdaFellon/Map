const map = L.map('map', {
  zoomControl: true,
  attributionControl: false
}).setView([58, 60], 4);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { maxZoom: 18 }
).addTo(map);


// ===== ГРАНИЦЫ СССР =====

fetch('data/ussr_1945.geojson')
  .then(res => res.json())
  .then(data => {

    const ussrLayer = L.geoJSON(data, {
      style: {
        color: "#111",
        weight: 2,
        fillColor: "#7f1d1d",
        fillOpacity: 0.05
      }
    }).addTo(map);

    map.fitBounds(ussrLayer.getBounds());

  });


// ===== ДАННЫЕ =====

let crimeLayer = L.layerGroup().addTo(map);
let crimeData = [];

function getColor(type) {
  switch(type) {
    case "Массовый расстрел": return "#7f1d1d";
    case "Сожжённый населённый пункт": return "#b45309";
    case "Лагерь": return "#1e3a8a";
    case "Депортация": return "#374151";
    default: return "#000000";
  }
}

fetch('data/crimes.json')
  .then(res => res.json())
  .then(data => {
    crimeData = data;
    renderMarkers("all");
  });


function renderMarkers(year) {

  crimeLayer.clearLayers();

  crimeData.forEach(event => {

    if (year !== "all" && event.year != year) return;

    const marker = L.circleMarker(
      [event.lat, event.lng],
      {
        radius: 6,
        color: getColor(event.type),
        fillColor: getColor(event.type),
        fillOpacity: 0.85,
        weight: 1
      }
    );

    marker.bindPopup(`
      <strong>${event.place}</strong><br><br>
      <strong>Дата:</strong> ${event.date}<br>
      <strong>Тип:</strong> ${event.type}<br>
      <strong>Жертвы:</strong> ${event.victims}<br><br>
      ${event.description}<br><br>
      <a href="${event.source}" target="_blank">Архивные материалы</a>
    `);

    crimeLayer.addLayer(marker);
  });

}


// ===== ФИЛЬТР =====

document.querySelectorAll('.filters button').forEach(btn => {

  btn.addEventListener('click', () => {

    document.querySelectorAll('.filters button')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    renderMarkers(btn.dataset.year);
  });

});


// ===== МОБИЛЬНОЕ МЕНЮ =====

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
