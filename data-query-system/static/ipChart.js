// ipChart.js - Handles the top 10 IPs chart with right-click selection
console.log("✅ ipchart.js LOADED");

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
                },
                plugins: {
                    legend: {
                        onClick: function(e, legendItem, legend) {
                            // Default behavior on single click - toggle visibility
                            const index = legendItem.datasetIndex;
                            const ci = legend.chart;
                            if (ci.isDatasetVisible(index)) {
                                ci.hide(index);
                                legendItem.hidden = true;
                            } else {
                                ci.show(index);
                                legendItem.hidden = false;
                            }
                        }
                    }
                },
                onHover: (event, activeElements, chart) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                }
            }
        });

        // Add right-click handler to canvas for IP selection
        const canvas = document.getElementById('ipChart');
        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            const chart = charts.ipChart;
            if (!chart) return;
            
            // Check if clicked on legend
            const legend = chart.legend;
            if (legend) {
                const x = e.offsetX;
                const y = e.offsetY;
                
                legend.legendItems.forEach((item, index) => {
                    const hitBox = legend.legendHitBoxes[index];
                    if (hitBox && 
                        x >= hitBox.left && x <= hitBox.left + hitBox.width &&
                        y >= hitBox.top && y <= hitBox.top + hitBox.height) {
                        // Right-clicked on a legend item - get the actual IP address
                        const datasetIndex = index;
                        const ipAddress = sortedIps[datasetIndex];
                        handleIpSelection(ipAddress);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading IP chart:', error);
    }
}
