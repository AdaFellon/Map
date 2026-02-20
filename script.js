const map = L.map('map').setView([53.5, 27.5], 5);
let markers = [];

function createMarkers(filterYear="all") {
    markers.forEach(m=>map.removeLayer(m));
    markers=[];

    locations.forEach(loc=>{
        if(filterYear!=="all" && !loc.years.includes(filterYear)) return;

        const marker=L.marker([loc.lat,loc.lng],{
            icon:getIcon(loc.color)
        }).addTo(map);

        marker.bindPopup(`
            <b>${loc.name}</b><br><br>
            📅 ${loc.date}<br>
            📍 ${loc.place}<br>
            ⚖ ${loc.type}<br>
            👥 ${loc.victims}<br>
            📝 ${loc.description}<br>
            <a href="${loc.archive}" target="_blank">Архив</a><br><br>
            <button onclick="openModal(${loc.id})"
            style="background:#b30000;color:white;border:none;
            padding:6px 10px;border-radius:5px;">
            Узнать больше</button>
        `);

        markers.push(marker);
    });
}

function openModal(id){
    const loc=locations.find(l=>l.id===id);

    document.getElementById("modal-body").innerHTML=`
        <h2>${loc.name}</h2>
        <img src="${loc.image}">
        <p><b>Дата:</b> ${loc.date}</p>
        <p><b>Место:</b> ${loc.place}</p>
        <p><b>Тип:</b> ${loc.type}</p>
        <p><b>Жертвы:</b> ${loc.victims}</p>
        <p>${loc.more}</p>
        <p><a href="${loc.archive}" target="_blank">Архивные документы</a></p>
    `;

    document.getElementById("modal").style.display="block";
}

document.getElementById("close").onclick=()=>{
    document.getElementById("modal").style.display="none";
};

window.onclick=(e)=>{
    if(e.target==document.getElementById("modal")){
        document.getElementById("modal").style.display="none";
    }
};

function filterByYear(year){ createMarkers(year); }
function showAll(){ createMarkers("all"); }

createMarkers("all");

/* МОБИЛЬНОЕ МЕНЮ */
document.getElementById("menu-toggle").onclick=function(){
    document.getElementById("sidebar").classList.toggle("active");
};

