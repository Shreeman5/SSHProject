// core.js - Core variables and utility functions
console.log("✅ core.js LOADED");

// Global configuration and utilities
const API_URL = 'http://localhost:5000/api';
let charts = {};
let currentFilters = {};
let colorIndex = 0;
let allDates = [];
let zoomHistory = [];
let previousZoomState = null;
let currentFormattedDates = [];
let isProcessingInvalidZoom = false;

const colorPalette = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0',
    '#a8edea', '#fed6e3', '#84fab0', '#8fd3f4',
    '#d299c2', '#fbc2eb', '#a6c1ee', '#f6d365',
    '#fda085', '#a1c4fd', '#c2e9fb', '#ffecd2'
];

function getNextColor() {
    return colorPalette[colorIndex++ % colorPalette.length];
}

function formatDate(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    const date = new Date(year, parseInt(month) - 1, day);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function parseFormattedDate(formattedDate) {
    const parts = formattedDate.split(' ');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = String(monthNames.indexOf(parts[0]) + 1).padStart(2, '0');
    const day = parts[1].replace(',', '').padStart(2, '0');
    const year = parts[2];
    return `${year}${month}${day}`;
}

function getCurrentZoomRange() {
    if (zoomHistory.length > 0) {
        return zoomHistory[zoomHistory.length - 1];
    }
    return null;
}

function goBackZoom() {
    if (zoomHistory.length > 1) {
        zoomHistory.pop();
        updateZoomUI();
        loadData();
    }
}

function updateZoomUI() {
    const zoomInfo = document.getElementById('zoomInfo');
    const backBtn = document.getElementById('zoomBackBtn');
    
    if (zoomHistory.length > 0) {
        zoomInfo.style.display = 'block';
        backBtn.disabled = zoomHistory.length <= 1;
    } else {
        zoomInfo.style.display = 'none';
    }
}

function getFilters() {
    const filters = {};
    
    const zoomRange = getCurrentZoomRange();
    if (zoomRange) {
        filters.date_from = zoomRange.from;
        filters.date_to = zoomRange.to;
    }
    
    if (currentFilters.countries && currentFilters.countries.length > 0) {
        filters.countries = currentFilters.countries;
    }
    if (currentFilters.usernames && currentFilters.usernames.length > 0) {
        filters.usernames = currentFilters.usernames;
    }
    if (currentFilters.asns && currentFilters.asns.length > 0) {
        filters.asns = currentFilters.asns;
    }
    if (currentFilters.date_from) {
        filters.date_from = currentFilters.date_from;
    }
    if (currentFilters.date_to) {
        filters.date_to = currentFilters.date_to;
    }
    
    return filters;
}

async function loadAllChartsExceptDate() {
    $('#loadingOverlay').css('display', 'flex');
    
    try {
        await Promise.all([
            loadStats(),
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

function showComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'flex';
}

function closeComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'none';
    awaitingSecondBrush = false;
}

function enableComparisonMode() {
    closeComparisonModal();
    awaitingSecondBrush = true;
    
    // Temporarily clear zoom history to reload date chart with full range
    const tempZoomHistory = [...zoomHistory];
    zoomHistory = [];
    
    // Reload ONLY the date chart with full date range
    loadDateChart().then(() => {
        // Restore zoom history after date chart loads
        zoomHistory = tempZoomHistory;
    });
    
    alert('Now brush on the date chart to select the second time period for comparison.');
}
