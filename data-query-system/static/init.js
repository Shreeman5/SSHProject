

$(document).ready(function() {
    $('.multi-select').select2({
        placeholder: 'Select options...',
        allowClear: true,
        width: '100%'
    });
    console.log("✅ init.js LOADED");
    loadFilterOptions();
    rebuildChartLayout();
    loadData();
});

async function loadFilterOptions() {
    try {
        const countries = await fetch(`${API_URL}/filters/countries`).then(r => r.json());
        if (countries.success) {
            countries.data.forEach(country => {
                $('#countriesFilter').append(new Option(country, country));
            });
        }

        const usernames = await fetch(`${API_URL}/filters/usernames`).then(r => r.json());
        if (usernames.success) {
            usernames.data.forEach(username => {
                $('#usernamesFilter').append(new Option(username, username));
            });
        }

        const asns = await fetch(`${API_URL}/filters/asns`).then(r => r.json());
        if (asns.success) {
            asns.data.forEach(asn => {
                $('#asnsFilter').append(new Option(asn, asn));
            });
        }
    } catch (error) {
        console.error('Error loading filter options:', error);
    }
}

function getFilters() {
    const filters = {};
    
    const countries = $('#countriesFilter').val();
    if (countries && countries.length > 0) filters.countries = countries;
    
    const usernames = $('#usernamesFilter').val();
    if (usernames && usernames.length > 0) filters.usernames = usernames;
    
    const asns = $('#asnsFilter').val();
    if (asns && asns.length > 0) filters.asns = asns;
    
    const currentZoom = getCurrentZoomRange();
    if (currentZoom) {
        filters.date_from = currentZoom.from;
        filters.date_to = currentZoom.to;
    } else {
        const dateFrom = $('#dateFrom').val();
        if (dateFrom) filters.date_from = dateFrom;
        
        const dateTo = $('#dateTo').val();
        if (dateTo) filters.date_to = dateTo;
    }
    
    return filters;
}

async function applyFilters() {
    currentFilters = getFilters();
    colorIndex = 0;
    zoomHistory = [];
    previousZoomState = null;
    timePeriod1 = null;
    timePeriod2 = null;
    comparisonMode = false;
    awaitingSecondBrush = false;
    selectedCountry1 = null;
    selectedCountry2 = null;
    countryComparisonMode = false;
    awaitingSecondCountry = false;
    comparisonSource = null;
    selectedIp1 = null;
    selectedIp2 = null;
    ipComparisonMode = false;
    awaitingSecondIp = false;
    selectedAsn1 = null;
    selectedAsn2 = null;
    asnComparisonMode = false;
    awaitingSecondAsn = false;
    selectedUsername1 = null;
    selectedUsername2 = null;
    usernameComparisonMode = false;
    awaitingSecondUsername = false;
    document.getElementById('exitComparisonBtn').style.display = 'none';
    updateZoomUI();
    rebuildChartLayout();
    await loadData();
}

function resetFilters() {
    $('#countriesFilter').val(null).trigger('change');
    $('#usernamesFilter').val(null).trigger('change');
    $('#asnsFilter').val(null).trigger('change');
    $('#dateFrom').val('');
    $('#dateTo').val('');
    currentFilters = {};
    colorIndex = 0;
    zoomHistory = [];
    previousZoomState = null;
    timePeriod1 = null;
    timePeriod2 = null;
    comparisonMode = false;
    awaitingSecondBrush = false;
    selectedCountry1 = null;
    selectedCountry2 = null;
    countryComparisonMode = false;
    awaitingSecondCountry = false;
    comparisonSource = null;
    selectedIp1 = null;
    selectedIp2 = null;
    ipComparisonMode = false;
    awaitingSecondIp = false;
    selectedAsn1 = null;
    selectedAsn2 = null;
    asnComparisonMode = false;
    awaitingSecondAsn = false;
    selectedUsername1 = null;
    selectedUsername2 = null;
    usernameComparisonMode = false;
    awaitingSecondUsername = false;
    document.getElementById('exitComparisonBtn').style.display = 'none';
    updateZoomUI();
    rebuildChartLayout();
    loadData();
}

async function loadData() {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        await Promise.all([
            loadStats(),
            loadDateChart(),
            loadCountryChart(),
            loadIpChart(),
            loadAsnChart(),
            loadUnusualChart(),
            loadUsernameChart()
        ]);
    } finally {
        $('#loadingOverlay').hide();
    }
}

async function loadStats() {
    try {
        const filters = getFilters();
        const response = await fetch(`${API_URL}/stats`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalRecords').textContent = data.stats.total_records.toLocaleString();
            document.getElementById('uniqueIPs').textContent = data.stats.unique_ips.toLocaleString();
            document.getElementById('uniqueUsers').textContent = data.stats.unique_users.toLocaleString();
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}