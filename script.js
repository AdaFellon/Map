const map = L.map('map').setView([54, 30], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let markers = [];

function getColor(type) {
    switch(type) {
        case "Концлагерь": return "red";
        case "Дулаг": return "yellow";
        case "Массовое убийство": return "black";
        case "Детский лагерь": return "purple";
        default: return "blue";
    }
}

function createMarkers(yearFilter = "all") {

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    locations.forEach(loc => {

        if (yearFilter !== "all" && loc.year !== yearFilter) return;

        const marker = L.circleMarker([loc.lat, loc.lng], {
            radius: 8,
            color: getColor(loc.type),
            fillColor: getColor(loc.type),
            fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(`
            <b>${loc.name}</b><br>
            ${loc.place}<br>
            ${loc.year}<br><br>
            <button onclick="openModal('${loc.name}', '${loc.image}', \`${loc.description}\`)">
            Узнать больше
            </button>
        `);

        markers.push(marker);
    });
}

function filterYear(year) {
    createMarkers(year);
}

createMarkers();


// Модальное окно
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

function openModal(title, image, description) {
    modal.style.display = "block";
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-image").src = image;
    document.getElementById("modal-description").innerText = description;
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display = "none"; };
