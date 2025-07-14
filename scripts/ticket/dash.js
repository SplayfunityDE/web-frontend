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
            'rgb(95, 125, 140, 1)',
            'rgb(255, 205, 86)',
            'rgb(227, 100, 100)'
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
        'Allgemein',
        'Bug'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50],
        borderAlign: "inner",
        backgroundColor: [
        'rgb(52,179,228,255)',
        'rgb(155,218,243,255)'
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