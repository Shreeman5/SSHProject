// comparison-handlers.js - Selection handlers for all comparison types
console.log("✅ comparisonhandlers.js LOADED");

// Handle Country Selection
function handleCountrySelection(country) {
    if (!countryComparisonMode && !awaitingSecondCountry && !selectedCountry1) {
        // First country selection
        selectedCountry1 = country;
        comparisonSource = 'country';
        loadChartsForCountry(country);
        showCountryComparisonModal();
    } else if (awaitingSecondCountry) {
        // Second country selection
        selectedCountry2 = country;
        countryComparisonMode = true;
        awaitingSecondCountry = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        loadCountryComparisonData();
    }
}

// Handle Country Selection from Unusual Chart
function handleCountrySelectionFromUnusual(country) {
    if (!countryComparisonMode && !awaitingSecondCountry && !selectedCountry1) {
        // First country selection from unusual chart
        selectedCountry1 = country;
        comparisonSource = 'unusual';
        loadChartsForCountryFromUnusual(country);
        showCountryComparisonModal();
    } else if (awaitingSecondCountry) {
        // Second country selection from unusual chart
        selectedCountry2 = country;
        countryComparisonMode = true;
        awaitingSecondCountry = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        loadCountryComparisonData();
    }
}

// Handle IP Selection
function handleIpSelection(ip) {
    if (!ipComparisonMode && !awaitingSecondIp && !selectedIp1) {
        selectedIp1 = ip;
        loadChartsForIp(ip);
        showIpComparisonModal();
    } else if (awaitingSecondIp) {
        selectedIp2 = ip;
        ipComparisonMode = true;
        awaitingSecondIp = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        loadIpComparisonData();
    }
}

// Handle ASN Selection
function handleAsnSelection(asn) {
    if (!asnComparisonMode && !awaitingSecondAsn && !selectedAsn1) {
        selectedAsn1 = asn;
        loadChartsForAsn(asn);
        showAsnComparisonModal();
    } else if (awaitingSecondAsn) {
        selectedAsn2 = asn;
        asnComparisonMode = true;
        awaitingSecondAsn = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        loadAsnComparisonData();
    }
}

// Handle Username Selection
function handleUsernameSelection(username) {
    if (!usernameComparisonMode && !awaitingSecondUsername && !selectedUsername1) {
        selectedUsername1 = username;
        loadChartsForUsername(username);
        showUsernameComparisonModal();
    } else if (awaitingSecondUsername) {
        selectedUsername2 = username;
        usernameComparisonMode = true;
        awaitingSecondUsername = false;
        document.getElementById('exitComparisonBtn').style.display = 'inline-block';
        rebuildChartLayout();
        loadUsernameComparisonData();
    }
}
