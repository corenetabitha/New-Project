// bookmarks.js - Accessible JavaScript for Bookmarks page

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookmarksGrid = document.getElementById('bookmarks-grid');
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    const filterSelect = document.querySelector('.filter-controls select');
    
    // Load bookmarks
    loadBookmarks();

    // Initialize event listeners
    setupEventListeners();

    async function loadBookmarks() {
        try {
            const bookmarks = await fetchBookmarks();
            if (bookmarks.length === 0) {
                showEmptyState();
            } else {
                renderBookmarks(bookmarks);
            }
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            showEmptyState();
        }
    }

    async function fetchBookmarks() {
        // In a real app, this would fetch from your API/localStorage
        // Example:
        // const response = await fetch('/api/bookmarks');
        // return await response.json();
        
        // Mock data - remove in production
        return [
            {
                id: 1,
                title: "The Silent Patient",
                author: "Alex Michaelides",
                cover: "https://m.media-amazon.com/images/I/61R+Cpm+HxL._AC_UF894,1000_QL80_.jpg",
                status: "reading",
                progress: 65,
                lastRead: "2023-05-18",
                page: 142
            }
        ];
    }

    function renderBookmarks(bookmarks) {
        bookmarksGrid.innerHTML = bookmarks.map(book => `
            <article class="bookmark-card" data-id="${book.id}" tabindex="0">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title} cover" loading="lazy">
                    <div class="bookmark-status">
                        Page ${book.page}
                    </div>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="progress">${book.progress}% read</span>
                        <button class="remove-bookmark" aria-label="Remove bookmark for ${book.title}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
    }

    function setupEventListeners() {
        // Search functionality
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Filter functionality
        filterSelect.addEventListener('change', applyFilters);

        // Remove bookmark buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-bookmark')) {
                const card = e.target.closest('.bookmark-card');
                removeBookmark(card.dataset.id);
            }
        });

        // Keyboard navigation for bookmark cards
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('bookmark-card')) {
                openBookDetails(e.target.dataset.id);
            }
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        console.log('Searching for:', query); // Implement actual search logic
    }

    function applyFilters() {
        const filterValue = filterSelect.value;
        console.log('Filtering by:', filterValue); // Implement actual filtering
    }

    function removeBookmark(bookId) {
        console.log('Removing bookmark:', bookId);
        // In a real app: Update your data store and re-render
    }

    function openBookDetails(bookId) {
        console.log('Opening book:', bookId);
        // window.location.href = `book.html?id=${bookId}`;
    }

    function showEmptyState() {
        bookmarksGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark fa-3x" aria-hidden="true"></i>
                <h3>No Bookmarks Yet</h3>
                <p>Save your progress by bookmarking books as you read</p>
                <a href="discover.html" class="btn">Discover Books</a>
            </div>
        `;
    }
});