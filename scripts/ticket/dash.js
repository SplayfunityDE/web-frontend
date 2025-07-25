const topic = document.getElementById('topicChart');
let token;

document.addEventListener("DOMContentLoaded", () => {
    token = localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");
    fetchOffenCount();
    fetchBearbeitungCount();
    fetchArchiviertCount();
    fetchGeschlssenCount();
    fetchTopicChart();
    fetchStatusChart();
    fetchActivityChart();
});

async function fetchOffenCount() {
    try {
        const res = await fetch("https://api.splayfer.de/ticket/count/open", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.text();

        document.querySelector(".screen .numberOffen").innerHTML = data;
        document.querySelector("#offenLoader").style.opacity = "0";

    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function fetchBearbeitungCount() {
    try {
        const res = await fetch("https://api.splayfer.de/ticket/count/claimed", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.text();

        document.querySelector(".screen .numberBearbeitung").innerHTML = data;
        document.querySelector("#bearbeitungLoader").style.opacity = "0";

    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function fetchArchiviertCount() {
    try {
        const res = await fetch("https://api.splayfer.de/ticket/count/archive", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.text();

        document.querySelector(".screen .numberArchiviert").innerHTML = data;
        document.querySelector("#archiviertLoader").style.opacity = "0";

    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function fetchGeschlssenCount() {
    try {
        const res = await fetch("https://api.splayfer.de/ticket/count/closed", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.text();

        document.querySelector(".screen .numberGeschlossen").innerHTML = data;
        document.querySelector("#geschlossenLoader").style.opacity = "0";

    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function fetchTopicChart() {
    try {
        const res = await fetch("https://api.splayfer.de/ticket/chart/topics", {
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

        document.querySelector("#topicLoader").style.opacity = "0";

        new Chart(topic, {
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
                    hoverOffset: 4
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
    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

async function fetchStatusChart() {
    const bearbeiter = document.getElementById('bearbeiterChart');

    try {
        const res = await fetch("https://api.splayfer.de/ticket/chart/status", {
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

        document.querySelector("#bearbeiterLoader").style.opacity = "0";

        new Chart(bearbeiter, {
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
                    hoverOffset: 4
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
    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}

const irgendwas = document.getElementById('irgendwasChart');

document.querySelector("#irgendwasLoader").style.opacity = "0";

new Chart(irgendwas, {
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
            hoverOffset: 4
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

async function fetchActivityChart() {
    const activity = document.getElementById('activityChart');

    try {
        const res = await fetch("https://api.splayfer.de/ticket/chart/activity", {
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
                    pointRadius: 5,
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
    } catch (error) {
        console.error("Fehler beim Laden der Tabelle:", error);
    }
}