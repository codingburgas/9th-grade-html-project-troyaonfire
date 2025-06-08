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

document.querySelector(".share-post").addEventListener("click", function() {
  const postType = document.querySelector(".share-post-select").value;
  const postTitle = document.querySelector(".share-post-title").value;
  const postContent = document.querySelector(".share-post-description").value;
  
  console.log(postType, postTitle, postContent, JSON.parse(localStorage.getItem('user')).email);
  if( postType && postTitle && postContent) {
    fetch('/createNewsPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postType: postType,
        postTitle: postTitle,
        description: postContent,
        email: JSON.parse(localStorage.getItem('user')).email // Pulling the email from the locally stored user data
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Post shared successfully!');
        // Optionally, clear the form fields
        document.querySelector(".share-post-select").value = '';
        document.querySelector(".share-post-title").value = '';
        document.querySelector(".share-post-description").value = '';
      } else {
        alert('Error sharing post: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while sharing the post.');
    });
  }
  else {
    alert('Please fill in all fields before sharing the post.');
  }
})