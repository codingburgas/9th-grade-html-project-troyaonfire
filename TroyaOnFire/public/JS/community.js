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
