document.addEventListener("DOMContentLoaded", function () {
	const canvas = document.getElementById('myChart');
	if (!canvas) return;

	const chartType = canvas.dataset.chart;
	const labels = JSON.parse(canvas.dataset.labels);
	const datasets = JSON.parse(canvas.dataset.datasets);

	if (!chartType || !labels.length || !datasets.length) {
		console.warn("Pas de données valides pour le graphique.");
		return;
	}

	const ctx = canvas.getContext('2d');

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
	});
});
