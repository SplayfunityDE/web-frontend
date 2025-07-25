var currentPage = 1;
const maxPerPage = 15;
const leftArrowTxt = "<i class='bx bx-fw  bxs-arrow-left-stroke'></i>";
const rightArrowTxt = "<i class='bx bx-fw  bxs-arrow-right-stroke'></i>";
const emptyRowCount = 4;

let isFetching = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchTable();
});


async function fetchTable(searchPattern) {
    const table = document.querySelector("table");
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";
    const field = document.getElementById("ticket-script")?.getAttribute("data-type") || "all";
    var urlStr = "";
    switch (field) {
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
    isFetching = true;
    try {
        const token = localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");
        const res = await fetch("https://api.splayfer.de/ticket/list/" + urlStr, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
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

            var searchVar = element.channelTxt || "undefined";
            if (searchPattern != null && !searchVar.toLowerCase().includes(searchPattern.toLowerCase()))
                return;

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

        if (count == 0) {
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
    isFetching = false;
}

async function reloadTable(searchPattern) {
    document.querySelector(".empty").style.opacity = "0";
    const table = document.querySelector("table");
    table.style.opacity = "0";
    document.querySelector("table caption").style.opacity = "0";
    document.querySelector(".loader").style.opacity = "1";
    fetchTable(searchPattern);
}

//code for resizable table content

window.onload = function () {
    (function () {
        var col_element,
            next_element,
            cursorStart = 0,
            dragStart = false,
            width,
            height,
            th_width,
            next_width = undefined,
            next_height,
            resize,
            resize_left,
            table_wt,
            resizeCheck;
        var container = document.getElementById("table_container"),
            table = document.getElementById("table_resize"),
            table_th = table.getElementsByTagName("th"),
            bodyRect = document.body.getBoundingClientRect();

        container.style.position = "relative";

        function mouseDown() {
            resize = this;
            resizeCheck = resize.classList.contains("y_resize");
            var col_index = parseInt(resize.getAttribute("data-resizecol")) - 1;
            col_element = table_th[col_index];
            next_element = table_th[col_index + 1];
            dragStart = true;
            cursorStart = resizeCheck ? event.pageX : event.pageY;
            var elm_bound = col_element.getBoundingClientRect();
            width = elm_bound.width;
            table_wt = table.offsetWidth;
            if (next_element != undefined) {
                var next_bound = next_element.getBoundingClientRect();
                next_width = next_bound.width;
            }
            resize_left = this.getBoundingClientRect().left - bodyRect.left;
        }
        function mouseMove() {
            if (dragStart) {
                var cursorPosition = resizeCheck ? event.pageX : event.pageY;
                var mouseMoved = cursorPosition - cursorStart;
                var newLeft = resize_left + mouseMoved;
                var newWidth = width + mouseMoved;
                var new_nextWidth, new_nextHeight;
                if (next_element != undefined) {
                    new_nextWidth = next_width - mouseMoved;
                }
                if (
                    newWidth > 30 &&
                    (new_nextWidth > 30 || next_element == undefined)
                ) {
                    col_element.style.cssText = "width: " + newWidth + "px;";
                    if (next_element != undefined) {
                        next_element.style.cssText = "width: " + new_nextWidth + "px";
                    } else {
                        table.style.width = table_wt + mouseMoved + "px";
                    }
                    resize.style.cssText = "left: " + newLeft + "px;";
                }
            }
            document.getSelection().removeAllRanges();
        }
        function mouseUp() {
            if (dragStart) {
                dragStart = false;
            }
        }
        function initEvents(table_th) {
            var tb_resize = container.getElementsByClassName("tb_resize");
            var th_length = table_th.length;
            for (var i = 0; i < th_length; i++) {
                document.body.addEventListener("mousemove", mouseMove);
                tb_resize[i].addEventListener("mousedown", mouseDown);
                tb_resize[i].addEventListener("mouseup", mouseUp);
                table_th[i].style.width = th_width + "px";
            }
        }
        function setTdWidth() {
            var elm_bound = table.getBoundingClientRect();
            var table_wt = elm_bound.width;
            var th_length = table_th.length;
            th_width = table_wt / th_length;
        }
        function createResizeDiv() {
            var cont = document.getElementById("table_container");
            cont.style.overflow = "hidden";
            var th_length = table_th.length;
            for (var i = 1; i <= th_length; i++) {
                var yDiv = document.createElement("div");
                yDiv.className = "y_resize tb_resize";
                yDiv.setAttribute("data-resizecol", i);
                var leftPos = i * th_width;
                yDiv.style.cssText = "left: " + leftPos + "px;";
                cont.append(yDiv);
            }
        }

        setTdWidth(table);
        createResizeDiv();
        initEvents(table_th);
    })();
};

//search bar logic
document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector(".search");
    let debounceTimeout;
    search.addEventListener("input", () => {
        clearTimeout(debounceTimeout);  // Löscht den vorherigen Timeout, falls der Benutzer weiterhin tippt

        debounceTimeout = setTimeout(() => {

            // Verhindert das Starten einer neuen Anfrage, wenn bereits eine läuft
            if (isFetching) {
                return;
            }

            console.log(search.value);

            if (!search.value.length == 0)
                reloadTable(search.value);
            else
                reloadTable();

        }, 500);  // 500 ms Wartezeit nach der letzten Eingabe
    });
});
