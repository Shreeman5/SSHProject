// asnChart.js - Handles the top 10 ASNs chart with right-click selection
console.log("✅ asncharts.js LOADED");


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

        // Add right-click handler to canvas for ASN selection
        const canvas = document.getElementById('asnChart');
        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            const chart = charts.asnChart;
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
                        // Right-clicked on a legend item
                        handleAsnSelection(item.text);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading ASN chart:', error);
    }
}
