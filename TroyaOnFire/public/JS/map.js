/**
 * FIRE REPORTING AND MAP FUNCTIONALITY
 */

// Map variables
let map;
let fireMarkers = [];
let fireReports = [];
let selectedLocationMarker = null;
let geocoder;

// Different icons for different fire types
const fireIcons = {
  kitchen: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  forest: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  building: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  vehicle: L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
};

// Initialize the map
const initializeMap = () => {
  // Try to get user's country from localStorage
  const userCountry = localStorage.getItem("userCountry");
  let defaultCoords = [42.6977, 23.3219]; // Default to Sofia coordinates
  let defaultZoom = 12;

  // If we have a country, try to geocode it
  if (userCountry) {
    fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(userCountry)}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          defaultCoords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          defaultZoom = 6; // Country level zoom
        }
        setupMap(defaultCoords, defaultZoom);
      })
      .catch(err => {
        console.error("Geocoding error:", err);
        setupMap(defaultCoords, defaultZoom);
      });
  } else {
    setupMap(defaultCoords, defaultZoom);
  }
};

// Set up the map with coordinates
const setupMap = (coords, zoom) => {
  map = L.map('map').setView(coords, zoom);

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add click event to map to set location
  map.on('click', function(e) {
    // Remove previous marker if exists
    if (selectedLocationMarker) {
      map.removeLayer(selectedLocationMarker);
    }
    
    // Add new marker
    selectedLocationMarker = L.marker(e.latlng, {
      icon: L.divIcon({
        className: 'selected-location-marker',
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [30, 30]
      })
    }).addTo(map);
    
    // Set coordinates in form
    document.getElementById('latitude').value = e.latlng.lat;
    document.getElementById('longitude').value = e.latlng.lng;
    
    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        let address = '';
        if (data.address) {
          if (data.address.road) address += data.address.road + ', ';
          if (data.address.city) address += data.address.city + ', ';
          if (data.address.country) address += data.address.country;
        }
        document.getElementById('location').value = address || `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
      })
      .catch(err => {
        console.error("Reverse geocoding error:", err);
        document.getElementById('location').value = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
      });
  });

  // Initialize search functionality
  initializeMapSearch();

  // Initialize clear location button
  initializeClearLocationButton();

  // Load any existing fire reports
  loadFireReports();
};

// Initialize clear location button
const initializeClearLocationButton = () => {
  const clearBtn = document.getElementById('clearLocationBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      document.getElementById('location').value = '';
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
      
      if (selectedLocationMarker) {
        map.removeLayer(selectedLocationMarker);
        selectedLocationMarker = null;
      }
    });
  }
};

// Initialize map search functionality
const initializeMapSearch = () => {
  const searchInput = document.getElementById('mapSearch');
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          searchLocation(query);
        }
      }
    });
  }
};

// Search for a location on the map
const searchLocation = (query) => {
  const searchInput = document.getElementById('mapSearch');
  searchInput.disabled = true;
  searchInput.placeholder = 'Searching...';
  
  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const firstResult = data[0];
        const latLng = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
        map.setView(latLng, 14);
        
        // Remove previous selected location marker if exists
        if (selectedLocationMarker) {
          map.removeLayer(selectedLocationMarker);
        }
        
        // Add temporary search result marker
        const tempMarker = L.marker(latLng, {
          icon: L.divIcon({
            className: 'search-result-marker',
            html: '<i class="fas fa-search-location"></i>',
            iconSize: [30, 30]
          })
        }).addTo(map);
        
        // Set as selected location
        selectedLocationMarker = tempMarker;
        
        // Update form fields
        document.getElementById('latitude').value = latLng[0];
        document.getElementById('longitude').value = latLng[1];
        document.getElementById('location').value = firstResult.display_name;
        
        // Remove temporary marker after 5 seconds
        setTimeout(() => {
          if (selectedLocationMarker === tempMarker) {
            map.removeLayer(tempMarker);
            selectedLocationMarker = L.marker(latLng, {
              icon: L.divIcon({
                className: 'selected-location-marker',
                html: '<i class="fas fa-map-marker-alt"></i>',
                iconSize: [30, 30]
              })
            }).addTo(map);
          }
        }, 5000);
      } else {
        alert('Location not found');
      }
    })
    .catch(err => {
      console.error('Search error:', err);
      alert('Error searching for location');
    })
    .finally(() => {
      searchInput.disabled = false;
      searchInput.placeholder = 'Enter address or region';
    });
};

// Save fire report to storage
const saveFireReport = (report) => {
  // Get existing reports from localStorage
  const existingReports = JSON.parse(localStorage.getItem('fireReports')) || [];
  
  // Add new report
  existingReports.push(report);
  
  // Save back to localStorage
  localStorage.setItem('fireReports', JSON.stringify(existingReports));
  
  // Export to JSON file
  exportReportToJSON(report);
  
  return report;
};

// Delete a fire report
const deleteFireReport = (id) => {
  if (confirm('Are you sure you want to delete this report?')) {
    // Get current reports
    const reports = JSON.parse(localStorage.getItem('fireReports')) || [];
    
    // Filter out the report to delete
    const updatedReports = reports.filter(report => report.id !== id);
    
    // Save back to localStorage
    localStorage.setItem('fireReports', JSON.stringify(updatedReports));
    
    // Remove from map
    removeFireMarker(id);
    
    // Remove from list
    removeFromIncidentsList(id);
    
    // Update export button visibility
    if (updatedReports.length === 0) {
      const exportBtn = document.getElementById('exportReportsBtn');
      if (exportBtn) exportBtn.remove();
      
      const clearBtn = document.getElementById('clearAllReportsBtn');
      if (clearBtn) clearBtn.remove();
    }
  }
};

// Remove fire marker from map
const removeFireMarker = (id) => {
  // Find and remove the marker from the map
  const markerIndex = fireMarkers.findIndex(marker => {
    const latLng = marker.getLatLng();
    const report = fireReports.find(r => r.id === id);
    return report && latLng.lat === report.lat && latLng.lng === report.lng;
  });
  
  if (markerIndex !== -1) {
    map.removeLayer(fireMarkers[markerIndex]);
    fireMarkers.splice(markerIndex, 1);
  }
};

// Remove incident from the list
const removeFromIncidentsList = (id) => {
  const incidentElement = document.querySelector(`.incident-card .delete-incident-btn[data-id="${id}"]`)?.closest('.incident-card');
  if (incidentElement) {
    incidentElement.remove();
  }
};

// Clear all fire reports
const clearAllReports = () => {
  if (confirm('Are you sure you want to delete ALL fire reports? This cannot be undone.')) {
    // Clear localStorage
    localStorage.removeItem('fireReports');
    
    // Clear all markers from map
    fireMarkers.forEach(marker => map.removeLayer(marker));
    fireMarkers = [];
    
    // Clear incidents list
    const incidentsList = document.getElementById('incidentsList');
    if (incidentsList) incidentsList.innerHTML = '';
    
    // Remove export and clear buttons
    const exportBtn = document.getElementById('exportReportsBtn');
    if (exportBtn) exportBtn.remove();
    
    const clearBtn = document.getElementById('clearAllReportsBtn');
    if (clearBtn) clearBtn.remove();
  }
};

// Export single report to JSON file
const exportReportToJSON = (report) => {
  const dataStr = JSON.stringify(report, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportName = `fire-report-${report.id}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// Export all reports to JSON file
const exportAllReportsToJSON = () => {
  const reports = JSON.parse(localStorage.getItem('fireReports')) || [];
  if (reports.length === 0) return;
  
  const dataStr = JSON.stringify(reports, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportName = `fire-reports-${new Date().toISOString()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// Add export button if reports exist
const addExportButton = () => {
  const reports = JSON.parse(localStorage.getItem('fireReports')) || [];
  if (reports.length === 0) return;
  
  // Check if button already exists
  if (document.getElementById('exportReportsBtn')) return;
  
  const exportBtn = document.createElement('button');
  exportBtn.id = 'exportReportsBtn';
  exportBtn.className = 'export-btn';
  exportBtn.innerHTML = '<i class="fas fa-download"></i> Export All Reports';
  exportBtn.addEventListener('click', exportAllReportsToJSON);
  
  const leftPanel = document.querySelector('.left-panel');
  if (leftPanel) {
    leftPanel.appendChild(exportBtn);
  }
  
  // Add clear all button if it doesn't exist
  addClearAllButton();
};

// Add clear all button
const addClearAllButton = () => {
  if (document.getElementById('clearAllReportsBtn')) return;
  
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clearAllReportsBtn';
  clearBtn.className = 'clear-all-btn';
  clearBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All Reports';
  clearBtn.addEventListener('click', clearAllReports);
  
  const leftPanel = document.querySelector('.left-panel');
  if (leftPanel) {
    leftPanel.appendChild(clearBtn);
  }
};

// Handle form submission
const initializeFireReporting = () => {
  const form = document.getElementById('incidentForm');
  const fireAlertBtn = document.getElementById('fireAlertBtn');
  const cancelBtn = document.getElementById('cancelReportBtn');
  const reportForm = document.getElementById('reportIncidentForm');

  if (!form) return;

  // Show/hide report form
  if (fireAlertBtn) {
    fireAlertBtn.addEventListener('click', () => {
      reportForm.style.display = 'block';
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      reportForm.style.display = 'none';
      form.reset();
      
      // Clear location selection
      document.getElementById('location').value = '';
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
      
      if (selectedLocationMarker) {
        map.removeLayer(selectedLocationMarker);
        selectedLocationMarker = null;
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = document.getElementById('incidentType').value;
    const severity = document.getElementById('severity').value;
    const location = document.getElementById('location').value;
    const lat = document.getElementById('latitude').value;
    const lng = document.getElementById('longitude').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!lat || !lng) {
      alert('Please select a location on the map or enter a valid address');
      return;
    }

    const report = {
      id: Date.now(),
      type,
      severity,
      location,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      title,
      description,
      timestamp: new Date().toISOString()
    };

    // Save the report
    const savedReport = saveFireReport(report);
    
    // Add to map and list
    addFireMarker(savedReport);
    addToIncidentsList(savedReport);
    
    // Reset form
    form.reset();
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    reportForm.style.display = 'none';
    
    // Remove selected location marker
    if (selectedLocationMarker) {
      map.removeLayer(selectedLocationMarker);
      selectedLocationMarker = null;
    }

    // Show success message
    alert('Fire report submitted successfully!');
    
    // Add export button if it doesn't exist
    addExportButton();
  });
};

// Add a fire marker to the map
const addFireMarker = (report) => {
  const marker = L.marker([report.lat, report.lng], {
    icon: fireIcons[report.type] || fireIcons.kitchen
  }).addTo(map);

  // Create popup content
  const popupContent = `
    <div class="fire-popup">
      <h4>${report.title}</h4>
      <p><strong>Type:</strong> ${report.type.replace(/^\w/, c => c.toUpperCase())}</p>
      <p><strong>Severity:</strong> <span class="severity-${report.severity}">${report.severity.replace(/^\w/, c => c.toUpperCase())}</span></p>
      <p><strong>Location:</strong> ${report.location}</p>
      <p>${report.description}</p>
      <small>Reported at: ${new Date(report.timestamp).toLocaleString()}</small>
      <button class="delete-popup-btn" data-id="${report.id}">Delete Report</button>
    </div>
  `;

  marker.bindPopup(popupContent);
  
  // Add event listener for popup delete button
  marker.on('popupopen', function() {
    document.querySelector(`.delete-popup-btn[data-id="${report.id}"]`)
      ?.addEventListener('click', () => {
        deleteFireReport(report.id);
        map.closePopup();
      });
  });
  
  fireMarkers.push(marker);
  fireReports.push(report);
};

// Load saved fire reports
const loadFireReports = () => {
  const savedReports = localStorage.getItem('fireReports');
  if (savedReports) {
    fireReports = JSON.parse(savedReports);
    fireReports.forEach(report => {
      addFireMarker(report);
      addToIncidentsList(report);
    });
    
    // Add export button if reports exist
    addExportButton();
  }
};

// Add incident to the recent incidents list
const addToIncidentsList = (report) => {
  const incidentsList = document.getElementById('incidentsList');
  if (!incidentsList) return;

  const incidentElement = document.createElement('div');
  incidentElement.className = 'incident-card';
  incidentElement.innerHTML = `
    <div class="incident-type">
      ${report.type.replace(/^\w/, c => c.toUpperCase())}
      <span class="incident-severity severity-${report.severity}">${report.severity.toUpperCase()}</span>
      <button class="delete-incident-btn" data-id="${report.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="incident-title">${report.title}</div>
    <div class="incident-location">${report.location}</div>
    <div class="incident-time">${new Date(report.timestamp).toLocaleString()}</div>
  `;

  // Add click event to focus on the marker
  incidentElement.addEventListener('click', (e) => {
    // Don't zoom if delete button was clicked
    if (e.target.closest('.delete-incident-btn')) return;
    
    map.setView([report.lat, report.lng], 15);
    fireMarkers.forEach(marker => {
      if (marker.getLatLng().lat === report.lat && marker.getLatLng().lng === report.lng) {
        marker.openPopup();
      }
    });
  });

  // Add delete button event listener
  const deleteBtn = incidentElement.querySelector('.delete-incident-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteFireReport(report.id);
  });

  // Add to the top of the list
  incidentsList.insertBefore(incidentElement, incidentsList.firstChild);
};

/**
 * SIDEBAR TOGGLE FUNCTIONALITY
 */
const initializeSidebarToggle = () => {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (!menuToggle || !sidebar) {
    console.error('Sidebar toggle elements not found');
    return;
  }

  menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    this.classList.toggle('active');
    
    if (!sidebar.classList.contains('open')) {
      const searchContainer = document.getElementById('searchContainer');
      searchContainer?.classList.remove('expanded');
    }
  });
};

/**
 * SEARCH BAR FUNCTIONALITY
 */
const initializeSearch = () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchContainer || !searchInput) {
    console.warn('Search elements not found');
    return;
  }

  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchContainer.classList.toggle('expanded');
    
    if (searchContainer.classList.contains('expanded')) {
      setTimeout(() => searchInput.focus(), 10);
    } else {
      searchInput.value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target) && !searchBtn.contains(e.target)) {
      searchContainer.classList.remove('expanded');
      searchInput.value = '';
    }
  });
};

/**
 * THEME TOGGLE FUNCTIONALITY
 */
const initializeThemeToggle = () => {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  if (!themeToggle) {
    console.warn('Theme toggle not found');
    return;
  }

  // Set initial state based on system preference
  themeToggle.checked = prefersDarkScheme.matches;
  
  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('themePreference', 
      document.body.classList.contains('light') ? 'light' : 'dark');
  });

  // Listen for system theme changes
  prefersDarkScheme.addListener((e) => {
    themeToggle.checked = e.matches;
    document.body.classList.toggle('light', !e.matches);
  });
};

/**
 * SIDEBAR LINK INTERACTIONS
 */
const enhanceSidebarLinks = () => {
  const navLinks = document.querySelectorAll('.sidebar ul li a');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
    
    // Set active link based on current page
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
};

/**
 * INITIALIZE ALL COMPONENTS
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeSidebarToggle();
  initializeSearch();
  initializeThemeToggle();
  enhanceSidebarLinks();
  initializeMap();
  initializeFireReporting();
  
  // Restore saved theme preference
  const savedTheme = localStorage.getItem('themePreference');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').checked = false;
  }
});

/**
 * WINDOW RESIZE HANDLER
 */
window.addEventListener('resize', () => {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    document.getElementById('menuToggle').classList.remove('active');
  }
});