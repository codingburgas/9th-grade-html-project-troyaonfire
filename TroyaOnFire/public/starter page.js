document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(savedTheme);
  
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('show');
      
      // Prevent scrolling when menu is open
      if (navLinks.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  
    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('show');
        document.body.style.overflow = 'auto';
      });
    });
  
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
      if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar') && 
          !e.target.closest('.nav-links') && 
          navLinks.classList.contains('show')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
    });
  });