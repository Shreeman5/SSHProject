// filters-reset.js - Filter and reset functions
console.log("✅ filtersreset.js LOADED");

function resetZoom() {
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

function exitComparisonMode() {
    comparisonMode = false;
    awaitingSecondBrush = false;
    timePeriod1 = null;
    timePeriod2 = null;
    countryComparisonMode = false;
    awaitingSecondCountry = false;
    selectedCountry1 = null;
    selectedCountry2 = null;
    comparisonSource = null;
    ipComparisonMode = false;
    awaitingSecondIp = false;
    selectedIp1 = null;
    selectedIp2 = null;
    asnComparisonMode = false;
    awaitingSecondAsn = false;
    selectedAsn1 = null;
    selectedAsn2 = null;
    usernameComparisonMode = false;
    awaitingSecondUsername = false;
    selectedUsername1 = null;
    selectedUsername2 = null;
    zoomHistory = [];
    document.getElementById('exitComparisonBtn').style.display = 'none';
    rebuildChartLayout();
    loadData();
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
