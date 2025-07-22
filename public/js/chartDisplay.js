document.addEventListener("DOMContentLoaded", function () {
    const labels = window.chartLabels
    const datasets = window.chartDatasets
    const chartType = window.chartType

    const ctx = document.getElementById('myChart').getContext('2d')
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#333'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
})
