// Theme Toggle Functionality 
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  body.classList.add('light-theme');
  themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }
});
document.getElementById('menuToggle').addEventListener('click', function() {
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.getElementById('menuToggle');

  sidebar.classList.toggle('open');
  menuIcon.classList.toggle('active');
});

document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');

  if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});
document.getElementById('searchBtn').addEventListener('click', function() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');

  searchContainer.classList.toggle('expanded');

  if (searchContainer.classList.contains('expanded')) {
    searchInput.focus();
  }
});
const searchInputs = {
  header: document.getElementById('searchInput'),
  department: document.getElementById('departmentSearch'),
  name: document.getElementById('nameSearch'),
  position: document.getElementById('staff-type-select'),
  country: document.getElementById('country-select')
};

const cards = document.querySelectorAll('.card:not(.no-results)');
const noResults = document.getElementById('noResults');
const resultsCounter = document.getElementById('resultsCounter');

function filterCards() {
  const filters = {
    header: searchInputs.header.value.toLowerCase().trim(),
    department: searchInputs.department.value.toLowerCase().trim(),
    name: searchInputs.name.value.toLowerCase().trim(),
    position: searchInputs.position.value.toLowerCase().trim(),
    country: searchInputs.country.value.toLowerCase().trim()
  };

  let visibleCount = 0;

  cards.forEach(card => {
    const cardData = {
      name: card.dataset.name.toLowerCase(),
      position: card.dataset.position.toLowerCase(),
      location: card.dataset.location.toLowerCase(),
      country: card.dataset.country.toLowerCase()
    };

    let isVisible = true;

    if (filters.header) {
      isVisible = isVisible && (
        cardData.name.includes(filters.header) ||
        cardData.position.includes(filters.header) ||
        cardData.location.includes(filters.header) ||
        cardData.country.includes(filters.header)
      );
    }

    if (filters.department) {
      isVisible = isVisible && cardData.location.includes(filters.department);
    }

    if (filters.name) {
      isVisible = isVisible && cardData.name.includes(filters.name);
    }

    if (filters.position) {
      isVisible = isVisible && cardData.position.includes(filters.position);
    }

    if (filters.country) {
      isVisible = isVisible && cardData.country.includes(filters.country);
    }

    if (isVisible) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (visibleCount === 0) {
    noResults.classList.remove('hidden');
    resultsCounter.textContent = 'No members found';
  } else {
    noResults.classList.add('hidden');
    resultsCounter.textContent = `Showing ${visibleCount} member${visibleCount !== 1 ? 's' : ''}`;
  }
}

Object.values(searchInputs).forEach(input => {
  input.addEventListener('input', filterCards);
  input.addEventListener('change', filterCards);
});

searchInputs.header.addEventListener('input', function() {
  if (this.value.trim()) {
    searchInputs.department.value = '';
    searchInputs.name.value = '';
    searchInputs.position.value = '';
    searchInputs.country.value = '';
  }
  filterCards();
});
const stats = {
  totalMembers: { element: document.getElementById('totalMembers'), current: 1247, target: 1247 },
  firefighters: { element: document.getElementById('firefighters'), current: 91, target: 91 },
  safetyExperts: { element: document.getElementById('safetyExperts'), current: 28, target: 28 },
  activeToday: { element: document.getElementById('activeToday'), current: 156, target: 156 }
};

function updateStats() {
  Object.keys(stats).forEach(key => {
    const stat = stats[key];
    const change = Math.floor(Math.random() * 21) - 10;
    const newValue = Math.max(0, stat.current + change);

    if (newValue !== stat.current) {
      const isIncrease = newValue > stat.current;
      stat.current = newValue;
      stat.element.textContent = stat.current.toLocaleString();

      stat.element.classList.remove('stat-increase', 'stat-decrease');

      if (isIncrease) {
        stat.element.classList.add('stat-increase');
      } else {
        stat.element.classList.add('stat-decrease');
      }

      setTimeout(() => {
        stat.element.classList.remove('stat-increase', 'stat-decrease');
      }, 500);
    }
  });
}

document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("userCountry")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginExpiry")
  location.href = "/HTML/login.html"
})

setInterval(updateStats, 3000);
setTimeout(updateStats, 2000);
filterCards();
