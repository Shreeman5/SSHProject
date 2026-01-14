// dateChart.js - Handles the main date/time chart with zoom capabilities
console.log("✅ datechart.js LOADED");

async function loadDateChart() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/charts/date`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const result = await response.json();
        
        if (!result.success) return;

        if (charts.dateChart) charts.dateChart.destroy();

        const multipleCountries = currentFilters.countries && currentFilters.countries.length > 1;

        if (multipleCountries) {
            const dateMap = {};
            result.data.forEach(row => {
                if (!dateMap[row.date]) dateMap[row.date] = {};
                dateMap[row.date][row.country] = row.count;
            });

            const dates = Object.keys(dateMap).sort();
            allDates = dates;
            const formattedDates = dates.map(d => formatDate(d));
            currentFormattedDates = formattedDates;
            
            const countryTotals = {};
            currentFilters.countries.forEach(country => {
                countryTotals[country] = dates.reduce((sum, date) => sum + (dateMap[date][country] || 0), 0);
            });
            
            const sortedCountries = [...currentFilters.countries].sort((a, b) => countryTotals[b] - countryTotals[a]);
            
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

            const ctx = document.getElementById('dateChart');
            charts.dateChart = new Chart(ctx, {
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
                        zoom: {
                            zoom: {
                                drag: {
                                    enabled: true,
                                    backgroundColor: 'rgba(102, 126, 234, 0.3)'
                                },
                                mode: 'x',
                                onZoomStart: function({chart}) {
                                    const xScale = chart.scales.x;
                                    previousZoomState = {
                                        min: xScale.min,
                                        max: xScale.max
                                    };
                                },
                                onZoomComplete: function({chart}) {
                                    if (isProcessingInvalidZoom) return;
                                    
                                    const xScale = chart.scales.x;
                                    const minIndex = Math.round(xScale.min);
                                    console.log('A:', minIndex)
                                    const maxIndex = Math.round(xScale.max);
                                    console.log('B:', maxIndex)
                                    
                                    if (maxIndex - minIndex < 2) {
                                        isProcessingInvalidZoom = true;
                                        alert('Please select at least 2 days. Single-day zoom is not allowed.');
                                        
                                        setTimeout(() => {
                                            loadDateChart().then(() => {
                                                isProcessingInvalidZoom = false;
                                            });
                                        }, 0);
                                        return;
                                    }
                                    
                                    const fromDate = parseFormattedDate(currentFormattedDates[minIndex]);
                                    console.log('C:', fromDate)
                                    const toDate = parseFormattedDate(currentFormattedDates[maxIndex]);
                                    console.log('D:', toDate)
                                    
                                    previousZoomState = {min: minIndex, max: maxIndex};
                                    handleZoomComplete(fromDate, toDate);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            const dates = result.data.map(x => x.date);
            allDates = dates;
            const formattedDates = dates.map(d => formatDate(d));
            currentFormattedDates = formattedDates;
            const values = result.data.map(x => x.count);

            const ctx = document.getElementById('dateChart');
            charts.dateChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: formattedDates,
                    datasets: [{
                        label: 'Attacks',
                        data: values,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
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
                        zoom: {
                            zoom: {
                                drag: {
                                    enabled: true,
                                    backgroundColor: 'rgba(102, 126, 234, 0.3)'
                                },
                                mode: 'x',
                                onZoomStart: function({chart}) {
                                    const xScale = chart.scales.x;
                                    console.log('E:', xScale)
                                    previousZoomState = {
                                        min: xScale.min,
                                        max: xScale.max
                                    };
                                },
                                onZoomComplete: function({chart}) {
                                    if (isProcessingInvalidZoom) return;
                                    
                                    const xScale = chart.scales.x;

                                    const minIndex = Math.round(xScale.min);
                                    console.log('A1:', xScale.min)
                                    console.log('A:', minIndex)

                                    const maxIndex = Math.round(xScale.max);
                                    console.log('A1:', xScale.max)
                                    console.log('B:', maxIndex)

                                    
                                    if (maxIndex - minIndex < 1) {
                                        isProcessingInvalidZoom = true;
                                        alert('Please select at least 2 days. Single-day zoom is not allowed.');
                                        
                                        setTimeout(() => {
                                            loadDateChart().then(() => {
                                                isProcessingInvalidZoom = false;
                                            });
                                        }, 0);
                                        return;
                                    }
                                    
                                    const fromDate = parseFormattedDate(currentFormattedDates[minIndex]);
                                    console.log('C:', fromDate)
                                    const toDate = parseFormattedDate(currentFormattedDates[maxIndex]);
                                    console.log('D:', toDate)
                                    
                                    previousZoomState = {min: minIndex, max: maxIndex};
                                    handleZoomComplete(fromDate, toDate);
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading date chart:', error);
    }
}
