// Проверка, существует ли блок карты
const mapContainer = document.getElementById('map');

if (!mapContainer) {
    console.error("Элемент #map не найден");
} else {

    const map = L.map('map').setView([55.75, 37.6], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    let markers = [];
    let data = [];

    function getColor(type) {
        if (type === "Расстрел") return "red";
        if (type === "Уничтожение") return "blue";
        if (type === "Лагерь") return "green";
        return "gray";
    }

    function renderMarkers() {
        // Удаляем старые маркеры
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        const yearSelect = document.getElementById("yearFilter");
        const typeSelect = document.getElementById("typeFilter");

        const year = yearSelect ? yearSelect.value : "all";
        const type = typeSelect ? typeSelect.value : "all";

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

        const counter = document.getElementById("eventCount");
        if (counter) {
            counter.innerText = "Событий: " + filtered.length;
        }
    }

    // 🔥 ВАЖНО: правильный путь для GitHub Pages
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки data.json: " + response.status);
            }
            return response.json();
        })
        .then(json => {
            data = json;
            renderMarkers();
        })
        .catch(error => {
            console.error("Ошибка загрузки JSON:", error);
        });

    // Фильтры
    const yearFilter = document.getElementById("yearFilter");
    const typeFilter = document.getElementById("typeFilter");

    if (yearFilter) yearFilter.addEventListener("change", renderMarkers);
    if (typeFilter) typeFilter.addEventListener("change", renderMarkers);

    // Авто-таймлайн
    const playBtn = document.getElementById("playTimeline");

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            const years = ["1941", "1942", "1943", "1944"];
            let i = 0;

            const interval = setInterval(() => {
                if (i >= years.length) {
                    clearInterval(interval);
                    return;
                }

                if (yearFilter) {
                    yearFilter.value = years[i];
                    renderMarkers();
                }

                i++;
            }, 2000);
        });
    }
}
