// ===============================
// ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ===============================

const map = L.map('map', {
  zoomControl: true,
  attributionControl: false
}).setView([58, 60], 4);

// Светлая подложка (академичный стиль)
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { maxZoom: 18 }
).addTo(map);


// ===============================
// ГРАНИЦЫ СССР 1945
// ===============================

let ussrLayer = null;

fetch('data/ussr_1945.geojson')
  .then(res => res.json())
  .then(data => {

    ussrLayer = L.geoJSON(data, {
      style: {
        color: "#111",
        weight: 2,
        fillColor: "#7f1d1d",
        fillOpacity: 0.05
      }
    }).addTo(map);

    map.fitBounds(ussrLayer.getBounds());

  })
  .catch(err => console.error("Ошибка загрузки границ:", err));


// ===============================
// ДАННЫЕ ПРЕСТУПЛЕНИЙ
// ===============================

let crimeLayer = L.layerGroup().addTo(map);
let crimeData = [];

function getColor(type) {
  switch(type) {
    case "Массовый расстрел":
      return "#7f1d1d";
    case "Сожжённый населённый пункт":
      return "#b45309";
    case "Лагерь":
      return "#1e3a8a";
    case "Депортация":
      return "#374151";
    default:
      return "#000000";
  }
}

fetch('data/crimes.json')
  .then(res => res.json())
  .then(data => {
    crimeData = data;
    renderMarkers("all");
  })
  .catch(err => console.error("Ошибка загрузки данных:", err));


// ===============================
// ОТРИСОВКА МАРКЕРОВ
// ===============================

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
      <div style="font-family: Georgia, serif; line-height: 1.4;">
        <strong>${event.place}</strong><br><br>
        <strong>Дата:</strong> ${event.date}<br>
        <strong>Тип:</strong> ${event.type}<br>
        <strong>Число жертв:</strong> ${event.victims}<br><br>
        ${event.description}<br><br>
        <a href="${event.source}" target="_blank">Архивные материалы</a>
      </div>
    `);

    crimeLayer.addLayer(marker);
  });

}


// ===============================
// ФИЛЬТР ПО ГОДАМ
// ===============================

document.querySelectorAll('.filters button').forEach(btn => {

  btn.addEventListener('click', () => {

    document.querySelectorAll('.filters button')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const selectedYear = btn.dataset.year;
    renderMarkers(selectedYear);
  });

});


// ===============================
// ЛЕГЕНДА
// ===============================

const legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {

  const div = L.DomUtil.create("div", "info legend");
  div.style.background = "white";
  div.style.padding = "12px";
  div.style.border = "1px solid #ccc";
  div.style.fontFamily = "Georgia, serif";
  div.style.fontSize = "13px";

  div.innerHTML = `
    <strong>Типы преступлений</strong><br><br>
    <span style="color:#7f1d1d;">●</span> Массовый расстрел<br>
    <span style="color:#b45309;">●</span> Сожжённый населённый пункт<br>
    <span style="color:#1e3a8a;">●</span> Лагерь<br>
    <span style="color:#374151;">●</span> Депортация
  `;

  return div;
};

legend.addTo(map);
