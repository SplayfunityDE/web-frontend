var currentPage = 1;
const maxPerPage = 15;
const leftArrowTxt = "<i class='bx bx-fw  bxs-arrow-left-stroke'></i>";
const rightArrowTxt = "<i class='bx bx-fw  bxs-arrow-right-stroke'></i>";
const emptyRowCount = 4;

document.addEventListener("DOMContentLoaded", () => {
    fetchTable();
});


async function fetchTable() {
    const table = document.querySelector("table");
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
    const field = document.getElementById("ticket-script")?.getAttribute("data-type") || "all";
    var urlStr = "";
    switch(field) {
        case "geschlossen":
            urlStr = "closed";
            break;
        case "archiviert":
            urlStr = "archive";
            break;
        default:
            urlStr = "all";
            break;
    }
    try {
        const res = await fetch("https://api.splayfer.de/ticket/list/" + urlStr, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        var i = 0;
        var count = 0;

        data.forEach(element => {
            switch (field) {
                case "offen":
                    if (element.supporter)
                        return;
                    break;
                case "bearbeitung":
                    if (!element.supporter)
                        return;
                    break;
                default:
                    break;
            }
            i++;
            if (i > (currentPage * maxPerPage) - maxPerPage && i <= currentPage * maxPerPage) {

                var row = tbody.insertRow();
                row.setAttribute("data-id", element.post);

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
                    case 1: type = "💬 Allgemein";
                        break;
                    case 2: type = "⚠️ Bug";
                        break;
                    case 3: type = "⛔ Report";
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

        if (data.length == 0) {
            for (let mainIndex = 0; mainIndex < emptyRowCount; mainIndex++) {
                var row = tbody.insertRow();
                const cell = row.insertCell();
                cell.textContent = "# ticketkanal";
                cell.className = "empty" + (mainIndex + 1);
                for (let index = 0; index < 4; index++) {
                    const cell = row.insertCell();
                    cell.className = "empty" + (mainIndex + 1);
                }
            }
            let transparencyMap = {};
            transparencyMap[1] = "1";
            transparencyMap[2] = "0.7";
            transparencyMap[3] = "0.5";
            transparencyMap[4] = "0.3";
            for (let index = 0; index < emptyRowCount; index++) {
                const cells = document.querySelectorAll(".empty" + (index + 1));
                cells.forEach(onecell => {
                    onecell.style.border = "1px solid rgb(199, 197, 197, " + transparencyMap[index + 1] + ")";
                    onecell.style.color = "rgba(255, 255, 255, 0)";
                    onecell.style.borderRight = "none";
                    onecell.style.borderLeft = "none";
                    onecell.style.borderBottom = "none";
                });
            }
            document.querySelector(".empty").style.opacity = "1";
            caption.innerHTML = "";
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

        const dataRows = document.querySelectorAll("tbody td");
        dataRows.forEach(element => {
            element.addEventListener("click", async () => {
                window.open("https://discord.com/channels/873506353551925308/" + element.parentElement.getAttribute("data-id"));
            });
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