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
