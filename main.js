const map = L.map('map', {
  zoomControl: true,
  attributionControl: false
}).setView([55, 40], 4);

// Тёмная подложка
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { maxZoom: 18 }
).addTo(map);

// ===== Границы СССР =====
fetch('data/ussr_1945.geojson')
  .then(res => res.json())
  .then(data => {
    const borderLayer = L.geoJSON(data, {
      style: {
        color: '#ef4444',
        weight: 3,
        fillColor: '#991b1b',
        fillOpacity: 0.1
      }
    }).addTo(map);

    map.fitBounds(borderLayer.getBounds());
  });

// ===== Данные преступлений =====
let crimeLayer = L.layerGroup().addTo(map);
let crimeData = [];

function getColor(type) {
  switch(type) {
    case "Массовый расстрел": return "#dc2626";
    case "Сожжённый населённый пункт": return "#f97316";
    case "Лагерь": return "#7c3aed";
    case "Депортация": return "#2563eb";
    default: return "#ffffff";
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
        radius: 7,
        color: getColor(event.type),
        fillColor: getColor(event.type),
        fillOpacity: 0.8
      }
    );

    marker.bindPopup(`
      <b>${event.place}</b><br>
      <b>Дата:</b> ${event.date}<br>
      <b>Тип:</b> ${event.type}<br>
      <b>Жертвы:</b> ${event.victims}<br>
      <p>${event.description}</p>
      <a href="${event.source}" target="_blank">Архивные материалы</a>
    `);

    crimeLayer.addLayer(marker);
  });
}

// ===== Фильтр =====
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {

    document.querySelectorAll('.filters button')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');
    renderMarkers(btn.dataset.year);
  });
});

