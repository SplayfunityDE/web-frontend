const body = document.querySelector("body");
const topic = document.getElementById('topicChart');
var token;

var chart1,
    chart2,
    chart3;

if (localStorage.getItem("darkmode") == "true") {
    body.classList.toggle("dark");
}

document.addEventListener("DOMContentLoaded", () => {
    token = localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");

    fetchCount("open");
    fetchCount("claimed");
    fetchCount("archive");
    fetchCount("closed");

    fetchTopicChart();
    fetchStatusChart();
    fetchActivityChart();
});

window.addEventListener('message', (event) => {
    // Optional: Herkunft prüfen (für Sicherheit)
    // if (event.origin !== 'https://deine-domain.de') return;

    if (typeof event.data.dark !== 'undefined') {
        body.classList.toggle("dark");
        updateChartColors();
    }
});

function updateChartColors() {
    const body = document.querySelector("body");

    // Sidebar-Farbe aus den CSS-Variablen holen
    const sidebarColor = getComputedStyle(body).getPropertyValue('--sidebar-color').trim();

    // Update die Farben der Charts
    if (chart1) {
        chart1.data.datasets[0].borderColor = sidebarColor;
        chart1.update();
    }
    if (chart2) {
        chart2.data.datasets[0].borderColor = sidebarColor;
        chart2.update();
    }
    if (chart3) {
        chart3.data.datasets[0].borderColor = sidebarColor;
        chart3.update();
    }
}

async function fetchCount(type) {
    const response = await Global.restRequest("https://api.splayfer.de/ticket/count/" + type, "GET", null);
    if (response !== null) {
        document.querySelector(".screen .number" + type).innerHTML = response;
        document.querySelector("#offenLoader").style.opacity = "0";
    } else {
        window.top.location.href = '/sites/login.html';
    }
}

async function fetchTopicChart() {

    const response = await Global.restRequest("https://api.splayfer.de/ticket/chart/topics", "GET", null);
    if (response === null)
        return;
    const data = response;

    document.querySelector("#topicLoader").style.opacity = "0";

    chart1 = new Chart(topic, {
        type: 'doughnut',
        data: {
            labels: [
                'Allgemein',
                'Bug',
                'Report'
            ],
            datasets: [{
                label: 'Tickets',
                data: [data["1"], data["2"], data["3"]],
                borderAlign: "inner",
                backgroundColor: [
                    'rgb(141, 171, 186)',
                    'rgb(235, 138, 138)',
                    'rgb(250, 211, 117)'
                ],
                hoverOffset: 4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
    chart1.data.datasets[0].borderColor = getComputedStyle(body).getPropertyValue('--sidebar-color').trim();
    chart1.update();
}

async function fetchStatusChart() {
    const bearbeiter = document.getElementById('bearbeiterChart');

    const response = await Global.restRequest("https://api.splayfer.de/ticket/chart/status", "GET", null);
    if (response === null)
        return;
    const data = response;

    document.querySelector("#bearbeiterLoader").style.opacity = "0";

    chart2 = new Chart(bearbeiter, {
        type: 'doughnut',
        data: {
            labels: [
                'In Bearbeitung',
                'Ausstehend'
            ],
            datasets: [{
                label: 'Tickets',
                data: [data.bearbeitung, data.offen],
                borderAlign: "inner",
                backgroundColor: [
                    '#4b7a7e',
                    '#74C2C4'
                ],
                hoverOffset: 4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
    chart2.data.datasets[0].borderColor = getComputedStyle(body).getPropertyValue('--sidebar-color').trim();
    chart2.update();
}

const irgendwas = document.getElementById('irgendwasChart');

document.querySelector("#irgendwasLoader").style.opacity = "0";

chart3 = new Chart(irgendwas, {
    type: 'doughnut',
    data: {
        labels: [
            'In asdfasdf',
            'Ausasfddasfstehend'
        ],
        datasets: [{
            label: 'Tickets',
            data: [4, 3, 8],
            borderAlign: "inner",
            backgroundColor: [
                'rgb(175, 122, 197)',
                'rgb(195, 155, 211)',
                'rgb(227, 202, 237)'
            ],
            hoverOffset: 4,
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});
chart3.data.datasets[0].borderColor = getComputedStyle(body).getPropertyValue('--sidebar-color').trim();
chart3.update();

async function fetchActivityChart() {
    const activity = document.getElementById('activityChart');

    const response = await Global.restRequest("https://api.splayfer.de/ticket/chart/activity", "GET", null);
    if (response === false)
        return;
    const data = response;

    document.querySelector("#activityLoader").style.opacity = "0";

    new Chart(activity, {
        type: 'line',
        data: {
            labels: [
                'Vor 5 Wochen',
                'Vor 4 Wochen',
                'Vor 3 Wochen',
                'Vor 2 Wochen',
                'Letzte Woche',
                'Diese Woche'
            ],
            datasets: [{
                label: 'Tickets',
                data: [
                    data["5"] || 0,
                    data["4"] || 0,
                    data["3"] || 0,
                    data["2"] || 0,
                    data["1"] || 0,
                    data["0"] || 0
                ],
                fill: true,
                borderColor: 'rgb(141, 171, 186)',
                tension: 0.1,
                borderWidth: 3,
                pointStyle: "circle",
                pointHitRadius: 20,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(141, 171, 186, 0.8)'
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 4,
            plugins: {
                legend: {
                    position: "none"
                }
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            return Number.isInteger(value) ? value : '';
                        }
                    }
                }
            }
        }
    });
}