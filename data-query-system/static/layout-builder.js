// layout-builder.js - Dynamic chart layout builder for all comparison modes
console.log("✅ layoutbuilder.js LOADED");
// layout-builder.js - Dynamic chart layout builder for all comparison modes

function rebuildChartLayout() {
    const chartGrid = document.getElementById('chartGrid');
    
    // Country Comparison Mode
    if (countryComparisonMode && selectedCountry1 && selectedCountry2) {
        chartGrid.className = 'chart-grid comparison-mode';
        chartGrid.innerHTML = `
            <!-- Row 1: Date Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-1">Country: ${selectedCountry1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-2">Country: ${selectedCountry2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart2"></canvas>
                </div>
            </div>

            <!-- Row 2: IP Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 IPs <span class="time-period-badge time-period-1">${selectedCountry1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 IPs <span class="time-period-badge time-period-2">${selectedCountry2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart2"></canvas>
                </div>
            </div>

            <!-- Row 3: ASN Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 ASNs <span class="time-period-badge time-period-1">${selectedCountry1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 ASNs <span class="time-period-badge time-period-2">${selectedCountry2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart2"></canvas>
                </div>
            </div>

            <!-- Row 4: Username Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 Usernames <span class="time-period-badge time-period-1">${selectedCountry1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 Usernames <span class="time-period-badge time-period-2">${selectedCountry2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart2"></canvas>
                </div>
            </div>
        `;
    }
    // IP Comparison Mode
    else if (ipComparisonMode && selectedIp1 && selectedIp2) {
        chartGrid.className = 'chart-grid comparison-mode';
        chartGrid.innerHTML = `
            <!-- Row 1: IP Charts -->
            <div class="chart-container">
                <div class="chart-title">IP Address <span class="time-period-badge time-period-1">IP: ${selectedIp1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">IP Address <span class="time-period-badge time-period-2">IP: ${selectedIp2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart2"></canvas>
                </div>
            </div>

            <!-- Row 2: Country Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-1">${selectedIp1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-2">${selectedIp2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart2"></canvas>
                </div>
            </div>

            <!-- Row 3: ASN Charts -->
            <div class="chart-container">
                <div class="chart-title">ASNs <span class="time-period-badge time-period-1">${selectedIp1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">ASNs <span class="time-period-badge time-period-2">${selectedIp2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart2"></canvas>
                </div>
            </div>

            <!-- Row 4: Username Charts -->
            <div class="chart-container">
                <div class="chart-title">Usernames <span class="time-period-badge time-period-1">${selectedIp1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Usernames <span class="time-period-badge time-period-2">${selectedIp2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart2"></canvas>
                </div>
            </div>
        `;
    }
    // ASN Comparison Mode
    else if (asnComparisonMode && selectedAsn1 && selectedAsn2) {
        chartGrid.className = 'chart-grid comparison-mode';
        chartGrid.innerHTML = `
            <!-- Row 1: IP Charts -->
            <div class="chart-container">
                <div class="chart-title">Top IPs <span class="time-period-badge time-period-1">ASN: ${selectedAsn1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top IPs <span class="time-period-badge time-period-2">ASN: ${selectedAsn2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart2"></canvas>
                </div>
            </div>

            <!-- Row 2: Country Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-1">${selectedAsn1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-2">${selectedAsn2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart2"></canvas>
                </div>
            </div>

            <!-- Row 3: ASN Charts -->
            <div class="chart-container">
                <div class="chart-title">ASN <span class="time-period-badge time-period-1">${selectedAsn1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">ASN <span class="time-period-badge time-period-2">${selectedAsn2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart2"></canvas>
                </div>
            </div>

            <!-- Row 4: Username Charts -->
            <div class="chart-container">
                <div class="chart-title">Usernames <span class="time-period-badge time-period-1">${selectedAsn1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Usernames <span class="time-period-badge time-period-2">${selectedAsn2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart2"></canvas>
                </div>
            </div>
        `;
    }
    // Username Comparison Mode
    else if (usernameComparisonMode && selectedUsername1 && selectedUsername2) {
        chartGrid.className = 'chart-grid comparison-mode';
        chartGrid.innerHTML = `
            <!-- Row 1: Date Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-1">User: ${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-2">User: ${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart2"></canvas>
                </div>
            </div>

            <!-- Row 2: Country Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-1">${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacking Countries <span class="time-period-badge time-period-2">${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart2"></canvas>
                </div>
            </div>

            <!-- Row 3: Unusual Charts -->
            <div class="chart-container">
                <div class="chart-title">Unusual Changes <span class="time-period-badge time-period-1">${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="unusualChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Unusual Changes <span class="time-period-badge time-period-2">${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="unusualChart2"></canvas>
                </div>
            </div>

            <!-- Row 4: IP Charts -->
            <div class="chart-container">
                <div class="chart-title">Top IPs <span class="time-period-badge time-period-1">${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top IPs <span class="time-period-badge time-period-2">${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart2"></canvas>
                </div>
            </div>

            <!-- Row 5: ASN Charts -->
            <div class="chart-container">
                <div class="chart-title">Top ASNs <span class="time-period-badge time-period-1">${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top ASNs <span class="time-period-badge time-period-2">${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart2"></canvas>
                </div>
            </div>

            <!-- Row 6: Username Charts -->
            <div class="chart-container">
                <div class="chart-title">Username <span class="time-period-badge time-period-1">${selectedUsername1}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Username <span class="time-period-badge time-period-2">${selectedUsername2}</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart2"></canvas>
                </div>
            </div>
        `;
    }
    // Time Period Comparison Mode
    else if (comparisonMode && timePeriod1 && timePeriod2) {
        chartGrid.className = 'chart-grid comparison-mode';
        chartGrid.innerHTML = `
            <!-- Row 1: Date Charts -->
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-1">Period 1: ${formatDate(timePeriod1.from)} - ${formatDate(timePeriod1.to)}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time <span class="time-period-badge time-period-2">Period 2: ${formatDate(timePeriod2.from)} - ${formatDate(timePeriod2.to)}</span></div>
                <div class="chart-wrapper">
                    <canvas id="dateChart2"></canvas>
                </div>
            </div>

            <!-- Row 2: Country Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 Attacking Countries <span class="time-period-badge time-period-1">Period 1</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 Attacking Countries <span class="time-period-badge time-period-2">Period 2</span></div>
                <div class="chart-wrapper">
                    <canvas id="countryChart2"></canvas>
                </div>
            </div>

            <!-- Row 3: Unusual Charts -->
            <div class="chart-container">
                <div class="chart-title">Unusual Changes <span class="time-period-badge time-period-1">Period 1</span></div>
                <div class="chart-wrapper">
                    <canvas id="unusualChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Unusual Changes <span class="time-period-badge time-period-2">Period 2</span></div>
                <div class="chart-wrapper">
                    <canvas id="unusualChart2"></canvas>
                </div>
            </div>

            <!-- Row 4: IP Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 IPs <span class="time-period-badge time-period-1">Period 1</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 IPs <span class="time-period-badge time-period-2">Period 2</span></div>
                <div class="chart-wrapper">
                    <canvas id="ipChart2"></canvas>
                </div>
            </div>

            <!-- Row 5: ASN Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 ASNs <span class="time-period-badge time-period-1">Period 1</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 ASNs <span class="time-period-badge time-period-2">Period 2</span></div>
                <div class="chart-wrapper">
                    <canvas id="asnChart2"></canvas>
                </div>
            </div>

            <!-- Row 6: Username Charts -->
            <div class="chart-container">
                <div class="chart-title">Top 10 Usernames <span class="time-period-badge time-period-1">Period 1</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart1"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 Usernames <span class="time-period-badge time-period-2">Period 2</span></div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart2"></canvas>
                </div>
            </div>
        `;
    }
    // Normal Mode (single column)
    else {
        chartGrid.className = 'chart-grid';
        chartGrid.innerHTML = `
            <div class="chart-container">
                <div class="chart-title">Attacks Over Time (Drag to zoom - minimum 2 days)</div>
                <div class="chart-wrapper">
                    <canvas id="dateChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 Attacking Countries Over Time</div>
                <div class="chart-wrapper">
                    <canvas id="countryChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Unusual Changes in Country Attacks Over Time</div>
                <div class="chart-wrapper">
                    <canvas id="unusualChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 IPs Over Time</div>
                <div class="chart-wrapper">
                    <canvas id="ipChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 ASNs Over Time</div>
                <div class="chart-wrapper">
                    <canvas id="asnChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Top 10 Usernames Over Time</div>
                <div class="chart-wrapper">
                    <canvas id="usernameChart"></canvas>
                </div>
            </div>
        `;
    }
}


function handleZoomComplete(fromDate, toDate) {
    if (!comparisonMode && !awaitingSecondBrush && zoomHistory.length === 0) {
        // First brush - store it, update charts, and ask user
        console.log('here')
        timePeriod1 = { from: fromDate, to: toDate };
        zoomHistory.push(timePeriod1);
        updateZoomUI();
        loadAllChartsExceptDate();
        showComparisonModal();
    } else if (awaitingSecondBrush) {
        // Second brush - enter comparison mode
        console.log('here2')
        timePeriod2 = { from: fromDate, to: toDate };
        comparisonMode = true;
        awaitingSecondBrush = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        console.log('here3')
        loadComparisonData();
        console.log('here4')
    } else if (!comparisonMode) {
        // Normal zoom behavior (not in comparison)
        zoomHistory.push({ from: fromDate, to: toDate });
        updateZoomUI();
        loadAllChartsExceptDate();
    }
}

async function loadComparisonData() {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        colorIndex = 0;
        
        // Load Period 1 charts (no country/unusual charts)
        await loadDateChartComparison('dateChart1', timePeriod1);
        await loadIpChartComparison('ipChart1', timePeriod1);
        await loadAsnChartComparison('asnChart1', timePeriod1);
        await loadUsernameChartComparison('usernameChart1', timePeriod1);
        await loadCountryChartComparison('countryChart1', timePeriod1);
        await loadUnusualChartComparison('unusualChart1', timePeriod1);
        
        colorIndex = 0;
        
        // Load Period 2 charts (no country/unusual charts)
        await loadDateChartComparison('dateChart2', timePeriod2);
        await loadIpChartComparison('ipChart2', timePeriod2);
        await loadAsnChartComparison('asnChart2', timePeriod2);
        await loadUsernameChartComparison('usernameChart2', timePeriod2);
        await loadCountryChartComparison('countryChart2', timePeriod2);
        await loadUnusualChartComparison('unusualChart2', timePeriod2);
    } finally {
        $('#loadingOverlay').hide();
    }
}

async function loadDateChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/date`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success) return;

    if (charts[canvasId]) charts[canvasId].destroy();

    const dates = result.data.map(x => x.date);
    const formattedDates = dates.map(d => formatDate(d));
    const values = result.data.map(x => x.count);

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
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
                y: { beginAtZero: true },
                x: {}
            }
        }
    });
}

async function loadCountryChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/country`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success || result.data.length === 0) return;

    if (charts[canvasId]) charts[canvasId].destroy();

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

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels: formattedDates, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: {} }
        }
    });
}

async function loadUnusualChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/unusual`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success || result.data.length === 0) return;

    if (charts[canvasId]) charts[canvasId].destroy();

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

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels: formattedDates, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: {} }
        }
    });
}

async function loadIpChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/ip`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success || result.data.length === 0) return;

    if (charts[canvasId]) charts[canvasId].destroy();

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

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels: formattedDates, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: {} }
        }
    });
}

async function loadAsnChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/asn`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success || result.data.length === 0) return;

    if (charts[canvasId]) charts[canvasId].destroy();

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

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels: formattedDates, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: {} }
        }
    });
}

async function loadUsernameChartComparison(canvasId, timePeriod) {
    const filters = { ...currentFilters, date_from: timePeriod.from, date_to: timePeriod.to };
    const response = await fetch(`${API_URL}/charts/username`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filters)
    });
    const result = await response.json();
    if (!result.success || result.data.length === 0) return;

    if (charts[canvasId]) charts[canvasId].destroy();

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

    const ctx = document.getElementById(canvasId);
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels: formattedDates, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: {} }
        }
    });
}
