// unusualChart.js - Handles the unusual changes in country attacks chart

async function loadUnusualChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/unusual`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success || result.data.length === 0) return;

        if (charts.unusualChart) charts.unusualChart.destroy();

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
                tension: 0.4,
                borderWidth: 2
            };
        });

        const ctx = document.getElementById('unusualChart');
        charts.unusualChart = new Chart(ctx, {
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
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Countries with highest day-over-day attack rate changes',
                        font: { size: 12 },
                        color: '#6c757d'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading unusual chart:', error);
    }
}
