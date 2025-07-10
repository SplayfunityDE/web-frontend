document.addEventListener("DOMContentLoaded", () => {
    fetchTable();
});


async function fetchTable() {
    const table = document.querySelector("table");

    try {
        const res = await fetch("https://api.splayfer.de/ticket/list/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json(); // ✅ warte auf JSON
        console.log(data);

        const table = document.querySelector("table");

        data.forEach(element => {
            var row = table.insertRow();

            //kanal
            var cell = row.insertCell();
            cell.textContent = "# " + element.channelTxt;

            //nutzer
            var cell = row.insertCell();
            cell.textContent = element.creatorTxt;

            //erstelldatum
            var cell = row.insertCell();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            cell.textContent = new Date(Date.parse(element.createDate.$date)).toLocaleDateString("de-DE", options);

            //kategorie
            var type = "";
            switch (element.type) {
                case 1: type = "Allgemein";
                    break;
                case 2: type = "Bug";
                    break;
                case 3: type = "Report";
            }
            var cell = row.insertCell();
            cell.textContent = type;

            //bearbeiter
            var cell = row.insertCell();
            cell.textContent = element.supporterTxt;
        });

        table.style.opacity = "1";
        document.querySelector("table caption").style.opacity = "1";
        document.querySelector(".loader").style.opacity = "0";
    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}