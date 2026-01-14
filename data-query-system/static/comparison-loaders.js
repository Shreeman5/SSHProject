// comparison-loaders.js - Data loading functions for all comparison modes

console.log('✅ comparison-loaders.js LOADED');

// ========== COUNTRY COMPARISON LOADERS ==========
// ========== COUNTRY COMPARISON LOADERS ==========

// Load charts filtered by country (for first selection from country chart)
async function loadChartsForCountry(country) {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        const originalFilters = { ...currentFilters };
        currentFilters.countries = [country];
        
        await Promise.all([
            loadDateChart(),
            loadIpChart(),
            loadAsnChart(),
            loadUsernameChart()
        ]);
        
        currentFilters = originalFilters;
    } finally {
        $('#loadingOverlay').hide();
    }
}

// Load charts filtered by country from unusual chart (excludes country chart)
async function loadChartsForCountryFromUnusual(country) {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        const originalFilters = { ...currentFilters };
        currentFilters.countries = [country];
        
        await Promise.all([
            loadDateChart(),
            loadIpChart(),
            loadAsnChart(),
            loadUsernameChart()
        ]);
        
        currentFilters = originalFilters;
    } finally {
        $('#loadingOverlay').hide();
    }
}

// Load all charts for country comparison mode
async function loadCountryComparisonData() {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        colorIndex = 0;
        
        // Load Period 1 charts (no country/unusual charts)
        await loadDateChartForCountry('dateChart1', selectedCountry1);
        await loadIpChartForCountry('ipChart1', selectedCountry1);
        await loadAsnChartForCountry('asnChart1', selectedCountry1);
        await loadUsernameChartForCountry('usernameChart1', selectedCountry1);
        
        colorIndex = 0;
        
        // Load Period 2 charts (no country/unusual charts)
        await loadDateChartForCountry('dateChart2', selectedCountry2);
        await loadIpChartForCountry('ipChart2', selectedCountry2);
        await loadAsnChartForCountry('asnChart2', selectedCountry2);
        await loadUsernameChartForCountry('usernameChart2', selectedCountry2);
    } finally {
        $('#loadingOverlay').hide();
    }
}

// ========== IP COMPARISON LOADERS ==========

async function loadChartsForIp(ip) {
    $('#loadingOverlay').css('display', 'flex');
    try {
        const originalFilters = { ...currentFilters };
        currentFilters.ips = [ip];
        await Promise.all([
            loadCountryChart(),
            loadAsnChart(),
            loadUsernameChart()
        ]);
        currentFilters = originalFilters;
    } finally {
        $('#loadingOverlay').hide();
    }
}

async function loadIpComparisonData() {
    console.log('[loadIpComparisonData] ENTRY - IP1:', selectedIp1, 'IP2:', selectedIp2);
    $('#loadingOverlay').css('display', 'flex');
    try {
        colorIndex = 0;
        console.log('[loadIpComparisonData] Loading charts for IP1...');
        await loadIpChartForIp('ipChart1', selectedIp1);
        await loadCountryChartForIp('countryChart1', selectedIp1);
        await loadAsnChartForIp('asnChart1', selectedIp1);
        await loadUsernameChartForIp('usernameChart1', selectedIp1);
        
        colorIndex = 0;
        console.log('[loadIpComparisonData] Loading charts for IP2...');
        await loadIpChartForIp('ipChart2', selectedIp2);
        await loadCountryChartForIp('countryChart2', selectedIp2);
        await loadAsnChartForIp('asnChart2', selectedIp2);
        await loadUsernameChartForIp('usernameChart2', selectedIp2);
        console.log('[loadIpComparisonData] All charts loaded');
    } finally {
        $('#loadingOverlay').hide();
    }
}

// ========== ASN COMPARISON LOADERS ==========

async function loadChartsForAsn(asn) {
    $('#loadingOverlay').css('display', 'flex');
    try {
        const originalFilters = { ...currentFilters };
        currentFilters.asns = [asn];
        await Promise.all([
            loadCountryChart(),
            loadIpChart(),
            loadUsernameChart()
        ]);
        currentFilters = originalFilters;
    } finally {
        $('#loadingOverlay').hide();
    }
}

async function loadAsnComparisonData() {
    $('#loadingOverlay').css('display', 'flex');
    try {
        colorIndex = 0;
        await loadIpChartForAsn('ipChart1', selectedAsn1);
        await loadCountryChartForAsn('countryChart1', selectedAsn1);
        await loadAsnChartForAsn('asnChart1', selectedAsn1);
        await loadUsernameChartForAsn('usernameChart1', selectedAsn1);
        
        colorIndex = 0;
        await loadIpChartForAsn('ipChart2', selectedAsn2);
        await loadCountryChartForAsn('countryChart2', selectedAsn2);
        await loadAsnChartForAsn('asnChart2', selectedAsn2);
        await loadUsernameChartForAsn('usernameChart2', selectedAsn2);
    } finally {
        $('#loadingOverlay').hide();
    }
}

// ========== USERNAME COMPARISON LOADERS ==========

async function loadChartsForUsername(username) {
    $('#loadingOverlay').css('display', 'flex');
    try {
        const originalFilters = { ...currentFilters };
        currentFilters.usernames = [username];
        await Promise.all([
            loadDateChart(),
            loadCountryChart(),
            loadUnusualChart(),
            loadIpChart(),
            loadAsnChart()
        ]);
        currentFilters = originalFilters;
    } finally {
        $('#loadingOverlay').hide();
    }
}

async function loadUsernameComparisonData() {
    $('#loadingOverlay').css('display', 'flex');
    try {
        colorIndex = 0;
        await loadDateChartForUsername('dateChart1', selectedUsername1);
        await loadCountryChartForUsername('countryChart1', selectedUsername1);
        await loadUnusualChartForUsername('unusualChart1', selectedUsername1);
        await loadIpChartForUsername('ipChart1', selectedUsername1);
        await loadAsnChartForUsername('asnChart1', selectedUsername1);
        await loadUsernameChartForUsername('usernameChart1', selectedUsername1);
        
        colorIndex = 0;
        await loadDateChartForUsername('dateChart2', selectedUsername2);
        await loadCountryChartForUsername('countryChart2', selectedUsername2);
        await loadUnusualChartForUsername('unusualChart2', selectedUsername2);
        await loadIpChartForUsername('ipChart2', selectedUsername2);
        await loadAsnChartForUsername('asnChart2', selectedUsername2);
        await loadUsernameChartForUsername('usernameChart2', selectedUsername2);
    } finally {
        $('#loadingOverlay').hide();
    }
}

// ========== TIME PERIOD COMPARISON LOADERS ==========

async function loadComparisonData() {
    console.log('[loadComparisonData] Starting time period comparison data load');
    console.log('[loadComparisonData] Period 1:', timePeriod1);
    console.log('[loadComparisonData] Period 2:', timePeriod2);
    
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        colorIndex = 0;
        
        // Load Period 1 charts (all 6 charts)
        console.log('[loadComparisonData] Loading Period 1 charts...');
        await loadDateChartComparison('dateChart1', timePeriod1);
        await loadCountryChartComparison('countryChart1', timePeriod1);
        await loadUnusualChartComparison('unusualChart1', timePeriod1);
        await loadIpChartComparison('ipChart1', timePeriod1);
        await loadAsnChartComparison('asnChart1', timePeriod1);
        await loadUsernameChartComparison('usernameChart1', timePeriod1);
        
        colorIndex = 0;
        
        // Load Period 2 charts (all 6 charts)
        console.log('[loadComparisonData] Loading Period 2 charts...');
        await loadDateChartComparison('dateChart2', timePeriod2);
        await loadCountryChartComparison('countryChart2', timePeriod2);
        await loadUnusualChartComparison('unusualChart2', timePeriod2);
        await loadIpChartComparison('ipChart2', timePeriod2);
        await loadAsnChartComparison('asnChart2', timePeriod2);
        await loadUsernameChartComparison('usernameChart2', timePeriod2);
        
        console.log('[loadComparisonData] All charts loaded successfully');
    } finally {
        $('#loadingOverlay').hide();
    }
}