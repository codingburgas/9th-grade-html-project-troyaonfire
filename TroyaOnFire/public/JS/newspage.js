        /**
         * DATA STORAGE FUNCTIONS
         * Handles saving and loading posts from localStorage
         */
        const Storage = {
        // Save posts to localStorage
        savePosts: (posts) => {
            try {
            localStorage.setItem('fireSafetyPosts', JSON.stringify(posts));
            return true;
            } catch (error) {
            console.error('Error saving posts:', error);
            return false;
            }
        },
        
        // Load posts from localStorage
        loadPosts: () => {
            try {
            const posts = localStorage.getItem('fireSafetyPosts');
            return posts ? JSON.parse(posts) : [];
            } catch (error) {
            console.error('Error loading posts:', error);
            return [];
            }
        },
        
        // Add a new post to storage
        addPost: (post) => {
            const posts = Storage.loadPosts();
            posts.unshift(post); // Add new post at the beginning
            return Storage.savePosts(posts);
        },
        
        // Delete a post from storage
        deletePost: (postId) => {
            const posts = Storage.loadPosts();
            const updatedPosts = posts.filter(post => post.id !== postId);
            return Storage.savePosts(updatedPosts);
        }
        };

        /**
         * POST MANAGEMENT FUNCTIONS
         * Handles creating, displaying, and managing posts
         */
        const PostManager = {
        // Generate a unique ID for posts
        generateId: () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        // Create a new post object
        createPost: (formData, author) => {
            return {
            id: PostManager.generateId(),
            title: formData.get('title'),
            category: formData.get('category'),
            content: formData.get('content'),
            source: formData.get('source') || 'User Generated Content',
            author: author.name,
            initials: author.initials,
            timestamp: new Date().toISOString()
            };
        },
        
        // Format the time for display
        formatTime: (timestamp) => {
            const now = new Date();
            const postDate = new Date(timestamp);
            const diffInSeconds = Math.floor((now - postDate) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        },
        
        // Create HTML for a post
        createPostHtml: (post) => {
            const timeAgo = PostManager.formatTime(post.timestamp);
            const sourceUrl = post.source.startsWith('http') ? post.source : '#';
            const sourceName = post.source.startsWith('http') ? 
            new URL(post.source).hostname : post.source;
            
            return `
            <div class="news-card" data-post-id="${post.id}">
                <div class="post-meta">
                <div class="post-author">
                    <div class="user-avatar">${post.initials}</div>
                    <span>${post.author}</span>
                </div>
                <div class="post-time">${timeAgo}</div>
                </div>
                <h3 class="news-title">${post.title}</h3>
                <div class="news-content">${post.content}</div>
                <div class="news-footer">
                <div class="news-category">${post.category}</div>
                <div class="news-source">
                    <i class="fa-solid fa-circle" style="color: #4CAF50; font-size: 0.6rem;"></i>
                    ${sourceName}
                </div>
                </div>
            
                <div class="news-indicators">
                <div class="indicator active"></div>
                <div class="indicator"></div>
                <div class="indicator"></div>
                </div>
            </div>
            `;
        },
        
        // Load and display all posts
        loadAllPosts: () => {
            const newsGrid = document.getElementById('newsGrid');
            if (!newsGrid) return;
            
            const posts = Storage.loadPosts();
            newsGrid.innerHTML = '';
            
            if (posts.length === 0) {
            newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No posts yet. Be the first to create one!</p>';
            return;
            }
            
            posts.forEach(post => {
            const postHtml = PostManager.createPostHtml(post);
            newsGrid.insertAdjacentHTML('beforeend', postHtml);
            });
        }
        };

        /**
         * MODAL MANAGEMENT FUNCTIONS
         * Handles the post creation modal
         */
        const ModalManager = {
        // Initialize modal functionality
        init: () => {
            const addPostBtn = document.getElementById('addPostBtn');
            const postModal = document.getElementById('postModal');
            const closeModal = document.getElementById('closeModal');
            const cancelPost = document.getElementById('cancelPost');
            const postForm = document.getElementById('postForm');
            
            // Current user (in a real app, this would come from authentication)
            const currentUser = {
            name: 'Current User',
            initials: 'CU'
            };
            
            // Open modal
            addPostBtn.addEventListener('click', () => {
            postModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            });
            
            // Close modal
            const closeModalFunc = () => {
            postModal.classList.remove('active');
            document.body.style.overflow = '';
            postForm.reset();
            };
            
            closeModal.addEventListener('click', closeModalFunc);
            cancelPost.addEventListener('click', closeModalFunc);
            
            // Close modal when clicking overlay
            postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                closeModalFunc();
            }
            });
            
            // Handle form submission
            postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(postForm);
            const post = PostManager.createPost(formData, currentUser);
            
            // Save the post
            if (Storage.addPost(post)) {
                // Reload posts to show the new one
                PostManager.loadAllPosts();
                
                // Show success message
                NotificationManager.show('Post created successfully!');
            } else {
                NotificationManager.show('Failed to save post', 'error');
            }
            
            // Close modal
            closeModalFunc();
            });
        }
        };

        /**
         * NOTIFICATION MANAGEMENT
         * Shows temporary notifications to the user
         */
        const NotificationManager = {
        show: (message, type = 'success') => {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
            notification.classList.add('show');
            }, 100);
            
            // Hide after 3 seconds
            setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
            }, 3000);
        }
        };

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
            });
        });
        };

        document.addEventListener('DOMContentLoaded', () => {
        initializeSidebarToggle();
        initializeSearch();
        initializeThemeToggle();
        enhanceSidebarLinks();
        initializeTabs();
        ModalManager.init();
        DeleteManager.init();
        
        // Load all posts when page loads
        PostManager.loadAllPosts();
        });

        
        window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            document.getElementById('menuToggle').classList.remove('active');
        }
        });

        
        const DeleteManager = {
        currentPostId: null,
        
        init: () => {
            // Event delegation for delete buttons
            document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-post-btn')) {
                const postId = e.target.closest('.delete-post-btn').dataset.postId;
                DeleteManager.showDeleteModal(postId);
            }
            });
            
            // Initialize modal buttons
            document.getElementById('cancelDelete')?.addEventListener('click', DeleteManager.hideDeleteModal);
            document.getElementById('closeDeleteModal')?.addEventListener('click', DeleteManager.hideDeleteModal);
            document.getElementById('confirmDelete')?.addEventListener('click', DeleteManager.deletePost);
        },
        
        showDeleteModal: (postId) => {
            DeleteManager.currentPostId = postId;
            document.getElementById('deleteModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        
        hideDeleteModal: () => {
            document.getElementById('deleteModal').classList.remove('active');
            document.body.style.overflow = '';
            DeleteManager.currentPostId = null;
        },
        
        deletePost: () => {
            if (!DeleteManager.currentPostId) return;
            
            if (Storage.deletePost(DeleteManager.currentPostId)) {
            PostManager.loadAllPosts();
            NotificationManager.show('Post deleted successfully!');
            } else {
            NotificationManager.show('Failed to delete post', 'error');
            }
            
            DeleteManager.hideDeleteModal();
        }
        };