/**
 * SIDEBAR TOGGLE FUNCTIONALITY
 * Toggles the sidebar open/closed and animates the menu icon
 */
const initializeSidebarToggle = () => {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (!menuToggle || !sidebar) {
    console.error('Sidebar toggle elements not found');
    return;
  }

  menuToggle.addEventListener('click', function() {
    // Toggle sidebar open state
    sidebar.classList.toggle('open');
    
    // Animate menu icon (hamburger to X)
    this.classList.toggle('active');
    
    // Optional: Close search if open when closing sidebar
    if (!sidebar.classList.contains('open')) {
      const searchContainer = document.getElementById('searchContainer');
      searchContainer?.classList.remove('expanded');
    }
  });
};

/**
 * SEARCH BAR FUNCTIONALITY
 * Expands/collapses search input and manages focus
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
    e.stopPropagation(); // Prevent event bubbling
    
    // Toggle search expansion
    searchContainer.classList.toggle('expanded');
    
    if (searchContainer.classList.contains('expanded')) {
      // Focus input when expanded
      setTimeout(() => searchInput.focus(), 10);
    } else {
      // Clear input when collapsed
      searchInput.value = '';
    }
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target) && !searchBtn.contains(e.target)) {
      searchContainer.classList.remove('expanded');
      searchInput.value = '';
    }
  });
};

/**
 * THEME TOGGLE FUNCTIONALITY
 * Switches between light/dark theme modes
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
    
    // Save preference to localStorage
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
 * Adds hover effects and active state to navigation links
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
    
    link.addEventListener('click', () => {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      link.classList.add('active');
    });
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
  
  // Restore saved theme preference
  const savedTheme = localStorage.getItem('themePreference');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').checked = false;
  }
});

/**
 * WINDOW RESIZE HANDLER
 * Close sidebar on mobile when resizing to desktop
 */
window.addEventListener('resize', () => {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    document.getElementById('menuToggle').classList.remove('active');
  }
});
// 1. Initialize map
const map = L.map('map').setView([20, 0], 2); // World view initially

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. Get country from localStorage
const userCountry = localStorage.getItem("userCountry");

if (userCountry) {
  // 3. Geocode the country name using Nominatim
  fetch(`https://nominatim.openstreetmap.org/search?country=${userCountry}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 6); // Zoom to country level
      } else {
        console.warn("Country not found on map.");
      }
    })
    .catch(err => {
      console.error("Geocoding error:", err);
    });
}
