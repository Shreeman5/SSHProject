// ipChart.js - Handles the top 10 IPs chart

async function loadIpChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/ip`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success || result.data.length === 0) return;

        if (charts.ipChart) charts.ipChart.destroy();

        const dateMap = {};
        const ips = new Set();
        
        result.data.forEach(row => {
            ips.add(row.ip_address);
            if (!dateMap[row.date]) dateMap[row.date] = {};
            dateMap[row.date][row.ip_address] = row.count;
        });

        const dates = Object.keys(dateMap).sort();
        const formattedDates = dates.map(d => formatDate(d));
        
        const ipTotals = {};
        ips.forEach(ip => {
            ipTotals[ip] = dates.reduce((sum, date) => sum + (dateMap[date][ip] || 0), 0);
        });
        
        const sortedIps = Array.from(ips).sort((a, b) => ipTotals[b] - ipTotals[a]);
        
        const datasets = sortedIps.map(ip => {
            const color = getNextColor();
            return {
                label: result.ip_labels[ip] || ip,
                data: dates.map(date => dateMap[date][ip] || 0),
                borderColor: color,
                backgroundColor: color + '33',
                fill: false,
                tension: 0.4
            };
        });

        const ctx = document.getElementById('ipChart');
        charts.ipChart = new Chart(ctx, {
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
        console.error('Error loading IP chart:', error);
    }
}
