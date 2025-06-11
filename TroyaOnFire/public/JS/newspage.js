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

        // Set initial state based on system preference or localStorage
        const savedTheme = localStorage.getItem('themePreference');
        if (savedTheme) {
            document.body.classList.toggle('light', savedTheme === 'light');
            themeToggle.checked = savedTheme === 'dark';
        } else {
            themeToggle.checked = prefersDarkScheme.matches;
        }
        
        themeToggle.addEventListener('change', () => {
            const isDark = themeToggle.checked;
            document.body.classList.toggle('light', !isDark);
            localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
        });

        // Listen for system theme changes
        prefersDarkScheme.addListener((e) => {
            if (!localStorage.getItem('themePreference')) {
            themeToggle.checked = e.matches;
            document.body.classList.toggle('light', !e.matches);
            }
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

        //Pull post data from database and load the posts on screen
        function loadPosts(typeOfPosts) {
            

            fetch(`/getPosts?typeOfPosts=${typeOfPosts}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector(`.${typeOfPosts}`).innerHTML = ''; // Clear existing posts

                    if (data.payload == true) {
                       if (data.posts.length > 0) {
                            if (typeOfPosts === 'news-grid') {
                                 data.posts.forEach(post => {
                                    document.querySelector(`.${typeOfPosts}`).innerHTML += `
                                       <div class="news-card" data-post-id="${post._id}">
                                           <div class="post-meta">
                                           <div class="post-author">
                                               <div class="user-avatar">${post.initials}</div>
                                               <span>${post.email}</span>
                                           </div>
                                           <div class="post-time">${post.createdAt.split("T")[0]}</div>
                                           </div>
                                           <h3 class="news-title">${post.postTitle}</h3>
                                           <div class="news-content">${post.postDescription}</div>
                                           <div class="news-footer">
                                           <div class="news-category">${post.postType}</div>
                                           </div>

                                           <div class="news-indicators">
                                           <div class="indicator active"></div>
                                           <div class="indicator"></div>
                                           <div class="indicator"></div>
                                           </div>
                                       </div>
                                        `;  
                            
                                        });
                            } else if (typeOfPosts === 'events-grid') {
                                data.posts.forEach(post => {
                                    document.querySelector(`.${typeOfPosts}`).innerHTML += `
                                       <div class="news-card" data-post-id="${post._id}">
                                           <div class="post-meta">
                                           <div class="post-author">
                                               <div class="user-avatar">${post.initials}</div>
                                               <span>${post.email}</span>
                                           </div>
                                           <div class="post-time">${post.createdAt.split("T")[0]}</div>
                                           </div>
                                           <h3 class="news-title">On ${post.eventDate} | At ${post.eventTime}</h3>
                                           <div class="news-content">In ${post.eventLocation}</div>
                                           <div class="news-footer">
                                           <div class="news-category">${post.eventType}</div>
                                           </div>

                                           <div class="news-indicators">
                                           <div class="indicator active"></div>
                                           <div class="indicator"></div>
                                           <div class="indicator"></div>
                                           </div>
                                       </div>
                                        `;  
                            
                                        });
                            }
                        }
                        
                    }
                })
                .catch(error => console.error('Error loading posts:', error));
        }
    

        /**
         * TAB FUNCTIONALITY
         */
        const initializeTabs = () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');

            // Show corresponding tab content
            const currentlyOpenTab = btn.getAttribute('data-action');
            const tabToBeOpened = btn.getAttribute('data-tab');

            document.querySelector(`.${currentlyOpenTab}`).style.display = 'none';
            document.querySelector(`.${tabToBeOpened}`).style.display = 'grid';

            loadPosts(tabToBeOpened);


            });
        });
        };

        loadPosts('news-grid');

        document.addEventListener('DOMContentLoaded', () => {
        initializeSidebarToggle();
        initializeSearch();
        initializeThemeToggle();
        enhanceSidebarLinks();
        initializeTabs();
        
        window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            document.getElementById('menuToggle').classList.remove('active');
        }
        });
    })


    document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("user")
  localStorage.removeItem("userCountry")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginExpiry")
  location.href = "/HTML/login.html"
})
    