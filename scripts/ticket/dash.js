  const topic = document.getElementById('topicChart');

  new Chart(topic, {
    type: 'doughnut',
    data: {
        labels: [
            'Allgemein',
            'Bug',
            'Report'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            borderAlign: "inner",
            backgroundColor: [
            'rgb(141, 171, 186)',
            'rgb(250, 211, 117)',
            'rgb(235, 138, 138)'
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

const bearbeiter = document.getElementById('bearbeiterChart');

new Chart(bearbeiter, {
type: 'doughnut',
data: {
    labels: [
        'In Bearbeitung',
        'Ausstehend'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [4, 8],
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

const irgendwas = document.getElementById('irgendwasChart');

new Chart(irgendwas, {
type: 'doughnut',
data: {
    labels: [
        'In asdfasdf',
        'Ausasfddasfstehend'
    ],
    datasets: [{
        label: 'My First Dataset',
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

const activity = document.getElementById('activityChart');

new Chart(activity, {
type: 'line',
data: {
    labels: [
        'test1',
        'test2'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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