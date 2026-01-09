// asnChart.js - Handles the top 10 ASNs chart

async function loadAsnChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/asn`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success || result.data.length === 0) return;

        if (charts.asnChart) charts.asnChart.destroy();

        const dateMap = {};
        const asns = new Set();
        
        result.data.forEach(row => {
            asns.add(row.asn_name);
            if (!dateMap[row.date]) dateMap[row.date] = {};
            dateMap[row.date][row.asn_name] = row.count;
        });

        const dates = Object.keys(dateMap).sort();
        const formattedDates = dates.map(d => formatDate(d));
        
        const asnTotals = {};
        asns.forEach(asn => {
            asnTotals[asn] = dates.reduce((sum, date) => sum + (dateMap[date][asn] || 0), 0);
        });
        
        const sortedAsns = Array.from(asns).sort((a, b) => asnTotals[b] - asnTotals[a]);
        
        const datasets = sortedAsns.map(asn => {
            const color = getNextColor();
            return {
                label: asn,
                data: dates.map(date => dateMap[date][asn] || 0),
                borderColor: color,
                backgroundColor: color + '33',
                fill: false,
                tension: 0.4
            };
        });

        const ctx = document.getElementById('asnChart');
        charts.asnChart = new Chart(ctx, {
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
        console.error('Error loading ASN chart:', error);
    }
}
