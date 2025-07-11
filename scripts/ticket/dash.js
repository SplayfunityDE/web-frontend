var currentPage = 1;
const maxPerPage = 15;
const leftArrowTxt = "<i class='bx bx-fw  bxs-arrow-left-stroke'></i>";
const rightArrowTxt = "<i class='bx bx-fw  bxs-arrow-right-stroke'></i>";

document.addEventListener("DOMContentLoaded", () => {
    fetchTable();
});


async function fetchTable() {
    const table = document.querySelector("table");
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
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

        const data = await res.json()

        var i = 0;
        var count = 0;

        data.forEach(element => {
            i++;
            if (i > (currentPage * maxPerPage) - maxPerPage && i <= currentPage * maxPerPage) {

                var row = tbody.insertRow();

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

            }
            count++;
        });

        const caption = document.querySelector("caption");
        const maxPages = Math.floor(count / maxPerPage) + 1;
        if (count <= maxPerPage) {
            caption.innerHTML = "Seite 1 von 1";
        } else {
            const pageTxt = "Seite " + currentPage + " von " + maxPages;
            if (currentPage == 1)
                caption.innerHTML = pageTxt + " " + rightArrowTxt;
            else if (currentPage == maxPages)
                caption.innerHTML = leftArrowTxt + " " + pageTxt;
            else
                caption.innerHTML = leftArrowTxt + " " + pageTxt + " " + rightArrowTxt;
        }

        table.style.opacity = "1";
        document.querySelector("table caption").style.opacity = "1";
        document.querySelector(".loader").style.opacity = "0";

        const rightArrow = document.querySelector(".bx-fw.bxs-arrow-right-stroke");
        if (rightArrow)
            rightArrow.addEventListener("click", async () => {
                currentPage += 1;
                reloadTable();
            });

        const leftArrow = document.querySelector(".bx-fw.bxs-arrow-left-stroke");
        if (leftArrow)
            leftArrow.addEventListener("click", async () => {
                currentPage -= 1;
                reloadTable();
            });

    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function reloadTable() {
    const table = document.querySelector("table");
    table.style.opacity = "0";
    document.querySelector("table caption").style.opacity = "0";
    document.querySelector(".loader").style.opacity = "1";
    fetchTable();
}