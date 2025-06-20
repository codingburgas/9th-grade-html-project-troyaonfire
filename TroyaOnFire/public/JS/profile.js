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

document.querySelector(".share-event").addEventListener("click", function() {
  const eventDate = document.querySelector(".event-date-select").value;
  const eventHour = document.querySelector(".event-hour-select").value;
  const eventLocation = document.querySelector(".share-event-location").value;
  const eventType = document.querySelector(".share-event-type").value;

  console.log(eventDate, eventHour, eventLocation, eventType, JSON.parse(localStorage.getItem('user')).email);
  if( eventDate && eventHour && eventLocation && eventType) {
    fetch('/createEventsPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventDate: eventDate,
        eventHour: eventHour,
        eventLocation: eventLocation,
        eventType: eventType,
        email: JSON.parse(localStorage.getItem('user')).email // Pulling the email from the locally stored user data
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Post shared successfully!');
        // Optionally, clear the form fields
        document.querySelector(".event-date-select").value = '';
        document.querySelector(".event-hour-select").value = '';
        document.querySelector(".share-event-location").value = '';
        document.querySelector(".share-event-type").value = '';
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

document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("userCountry")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginExpiry")
  location.href = "/HTML/login.html"
})

function loadUserData() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.querySelector('.user-full-name').textContent = user.firstName + ' ' + user.lastName;
    document.querySelector('.user-working-status').textContent = `Working Status: ${user.workingStatus}`;
    document.querySelector('.user-region').innerHTML = `<i class="fa-solid fa-location-dot fa-xs" style="color: #ca1c1c;"></i> ${user.region}`;

    fetch(`/getUserPostsCount?userEmail=${user.email}`).then(response => {
      response.json().then(data => {
        if (data.payload == true) {
          document.querySelector('.user-post-count').innerHTML = `${data.count}</br>posts`;
        } else {
          console.error('Error fetching post count');
          document.querySelector('.user-post-count').textContent = 'error';
        }
      });
    })

    document.querySelector('.avatar').innerHTML = `
      <label class="avatar-initials">
        <span>${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}</span>
      </label>
    `;

  } else {
    console.warn('No user data found in localStorage');
  }
}

try {
  loadUserData();
} catch (error) {
  alert("An error occurred while loading user data. Please try again later or check if you're logged in.");
}