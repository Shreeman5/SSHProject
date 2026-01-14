// comparison-core.js - Comparison mode variables and modal functions
console.log("✅ comparison-core.js LOADED");

// Comparison mode variables
let comparisonMode = false;
let awaitingSecondBrush = false;
let timePeriod1 = null;
let timePeriod2 = null;

// Country comparison variables
let countryComparisonMode = false;
let awaitingSecondCountry = false;
let selectedCountry1 = null;
let selectedCountry2 = null;
let comparisonSource = null; // 'country' or 'unusual'

// IP comparison variables
let ipComparisonMode = false;
let awaitingSecondIp = false;
let selectedIp1 = null;
let selectedIp2 = null;

// ASN comparison variables
let asnComparisonMode = false;
let awaitingSecondAsn = false;
let selectedAsn1 = null;
let selectedAsn2 = null;

// Username comparison variables
let usernameComparisonMode = false;
let awaitingSecondUsername = false;
let selectedUsername1 = null;
let selectedUsername2 = null;

// General comparison type tracker
let comparisonType = null; // 'time', 'country', 'ip', 'asn', 'username'

// Country Comparison Modal Functions
function showCountryComparisonModal() {
    document.getElementById('countryComparisonModal').style.display = 'flex';
}

function closeCountryComparisonModal() {
    document.getElementById('countryComparisonModal').style.display = 'none';
    awaitingSecondCountry = false;
}

function enableCountryComparisonMode() {
    closeCountryComparisonModal();
    awaitingSecondCountry = true;
    alert('Now right-click on another country in the legend to compare.');
}

function exitCountryComparisonMode() {
    countryComparisonMode = false;
    awaitingSecondCountry = false;
    selectedCountry1 = null;
    selectedCountry2 = null;
    document.getElementById('exitComparisonBtn').style.display = 'none';
    rebuildChartLayout();
    loadData();
}

// IP Comparison Modal Functions
function showIpComparisonModal() {
    document.getElementById('ipComparisonModal').style.display = 'flex';
}

function closeIpComparisonModal() {
    document.getElementById('ipComparisonModal').style.display = 'none';
    awaitingSecondIp = false;
}

function enableIpComparisonMode() {
    closeIpComparisonModal();
    awaitingSecondIp = true;
    alert('Now right-click on another IP in the legend to compare.');
}

// ASN Comparison Modal Functions
function showAsnComparisonModal() {
    document.getElementById('asnComparisonModal').style.display = 'flex';
}

function closeAsnComparisonModal() {
    document.getElementById('asnComparisonModal').style.display = 'none';
    awaitingSecondAsn = false;
}

function enableAsnComparisonMode() {
    closeAsnComparisonModal();
    awaitingSecondAsn = true;
    alert('Now right-click on another ASN in the legend to compare.');
}

// Username Comparison Modal Functions
function showUsernameComparisonModal() {
    document.getElementById('usernameComparisonModal').style.display = 'flex';
}

function closeUsernameComparisonModal() {
    document.getElementById('usernameComparisonModal').style.display = 'none';
    awaitingSecondUsername = false;
}

function enableUsernameComparisonMode() {
    closeUsernameComparisonModal();
    awaitingSecondUsername = true;
    alert('Now right-click on another username in the legend to compare.');
}
