// countryChart.js - Handles the top 10 attacking countries chart

async function loadCountryChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/country`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success || result.data.length === 0) return;

        if (charts.countryChart) charts.countryChart.destroy();

        const dateMap = {};
        const countries = new Set();
        
        result.data.forEach(row => {
            countries.add(row.country);
            if (!dateMap[row.date]) dateMap[row.date] = {};
            dateMap[row.date][row.country] = row.count;
        });

        const dates = Object.keys(dateMap).sort();
        const formattedDates = dates.map(d => formatDate(d));
        
        const countryTotals = {};
        countries.forEach(country => {
            countryTotals[country] = dates.reduce((sum, date) => sum + (dateMap[date][country] || 0), 0);
        });
        
        const sortedCountries = Array.from(countries).sort((a, b) => countryTotals[b] - countryTotals[a]);
        
        const datasets = sortedCountries.map(country => {
            const color = getNextColor();
            return {
                label: country,
                data: dates.map(date => dateMap[date][country] || 0),
                borderColor: color,
                backgroundColor: color + '33',
                fill: false,
                tension: 0.4
            };
        });

        const ctx = document.getElementById('countryChart');
        charts.countryChart = new Chart(ctx, {
            type: 'line',
            data: { labels: formattedDates, datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { 
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Attacks',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            font: { size: 14, weight: 'bold' }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading country chart:', error);
    }
}
