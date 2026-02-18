const map = L.map('map').setView([55.75, 37.6], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let markers = [];
let data = [];

fetch('data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        renderMarkers();
    });

function getColor(type) {
    if (type === "Расстрел") return "red";
    if (type === "Уничтожение") return "blue";
    if (type === "Лагерь") return "green";
}

function renderMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const year = document.getElementById("yearFilter").value;
    const type = document.getElementById("typeFilter").value;

    const filtered = data.filter(event => {
        return (year === "all" || event.year === year) &&
               (type === "all" || event.type === type);
    });

    filtered.forEach(event => {
        const marker = L.circleMarker(event.coords, {
            radius: 8,
            color: getColor(event.type),
            fillOpacity: 0.8
        }).bindPopup(`
            <b>${event.title}</b><br>
            <b>Год:</b> ${event.year}<br>
            <b>Тип:</b> ${event.type}<br>
            <b>Жертвы:</b> ${event.victims}<br>
            <b>Описание:</b> ${event.description}<br>
            <a href="${event.source}" target="_blank">Архивные документы</a>
        `);

        marker.addTo(map);
        markers.push(marker);
    });

    document.getElementById("eventCount").innerText = "Событий: " + filtered.length;
}

document.getElementById("yearFilter").addEventListener("change", renderMarkers);
document.getElementById("typeFilter").addEventListener("change", renderMarkers);

document.getElementById("playTimeline").addEventListener("click", () => {
    const years = ["1941","1942","1943","1944"];
    let i = 0;

    const interval = setInterval(() => {
        if (i >= years.length) {
            clearInterval(interval);
            return;
        }
        document.getElementById("yearFilter").value = years[i];
        renderMarkers();
        i++;
    }, 2000);
});
