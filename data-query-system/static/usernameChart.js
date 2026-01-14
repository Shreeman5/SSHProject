// usernameChart.js - Handles the top 10 usernames chart with right-click selection
console.log("✅ usernamechart.js LOADED");

async function loadUsernameChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/username`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success || result.data.length === 0) return;

        if (charts.usernameChart) charts.usernameChart.destroy();

        const dateMap = {};
        const usernames = new Set();
        
        result.data.forEach(row => {
            usernames.add(row.username);
            if (!dateMap[row.date]) dateMap[row.date] = {};
            dateMap[row.date][row.username] = row.count;
        });

        const dates = Object.keys(dateMap).sort();
        const formattedDates = dates.map(d => formatDate(d));
        
        const usernameTotals = {};
        usernames.forEach(username => {
            usernameTotals[username] = dates.reduce((sum, date) => sum + (dateMap[date][username] || 0), 0);
        });
        
        const sortedUsernames = Array.from(usernames).sort((a, b) => usernameTotals[b] - usernameTotals[a]);
        
        const datasets = sortedUsernames.map(username => {
            const color = getNextColor();
            return {
                label: username,
                data: dates.map(date => dateMap[date][username] || 0),
                borderColor: color,
                backgroundColor: color + '33',
                fill: false,
                tension: 0.4
            };
        });

        const ctx = document.getElementById('usernameChart');
        charts.usernameChart = new Chart(ctx, {
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

        // Add right-click handler to canvas for username selection
        const canvas = document.getElementById('usernameChart');
        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            const chart = charts.usernameChart;
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
                        handleUsernameSelection(item.text);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading username chart:', error);
    }
}
