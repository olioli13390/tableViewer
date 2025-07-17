    document.getElementById('chartForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const xAxis = formData.get('xAxis');
        const yAxis = formData.get('yAxis');
        const chartStyle = formData.get('chartStyle');

        const xAxisData = joinedData.map(row => row[xAxis]);
        const yAxisData = joinedData.map(row => {
            const value = parseFloat(row[yAxis]);
            return isNaN(value) ? 0 : value;
        });

        const chartData = {
            labels: xAxisData,
            datasets: [{
                label: yAxis,
                data: yAxisData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const ctx = document.getElementById('chartCanvas').getContext('2d');
        new Chart(ctx, {
            type: chartStyle,
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });