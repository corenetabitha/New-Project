
// library.js - Standalone implementation for Library page

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const libraryGrid = document.getElementById('library-grid');
    const filterSelect = document.getElementById('library-filter');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    
    // Library data
    let libraryBooks = [];
    let currentTab = 'books';

    // Initialize page
    initLibraryPage();

    async function initLibraryPage() {
        try {
            libraryBooks = await fetchLibraryBooks();
            renderBooks(libraryBooks);
            setupEventListeners();
        } catch (error) {
            console.error("Failed to load library:", error);
            showEmptyState();
        }
    }

    // Fetch library books (replace with your data source)
    async function fetchLibraryBooks() {
        // In a real app, this would fetch from your database/API
        // Example:
        // const response = await fetch('/api/library');
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
                lastRead: "2023-05-18"
            },
            {
                id: 2,
                title: "It Ends With Us",
                author: "Colleen Hoover",
                cover: "https://cdnattic.atticbooks.co.ke/img/U344316.jpg",
                status: "finished",
                progress: 100
            }
        ];
    }

    function renderBooks(booksToRender) {
        if (!booksToRender?.length) {
            showEmptyState();
            return;
        }

        libraryGrid.innerHTML = booksToRender.map(book => `
            <div class="library-card" data-id="${book.id}" data-status="${book.status}">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}">
                    <div class="book-status status-${book.status}">
                        ${formatStatus(book.status)}
                    </div>
                    <button class="heart-icon" aria-label="Toggle favorite">
                        <i class="${getFavoriteIconClass(book.id)}"></i>
                    </button>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    ${book.status === 'reading' ? `
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${book.progress}%"></div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        attachCardEventListeners();
    }

    function formatStatus(status) {
        const statusMap = {
            reading: "Reading",
            finished: "Finished",
            unread: "Not Started"
        };
        return statusMap[status] || status;
    }

    function setupEventListeners() {
        // Filter change
        filterSelect.addEventListener('change', applyFilters);
        
        // Tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
        
        // Search functionality
        searchBtn.addEventListener('click', applySearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') applySearch();
        });
        
        // Initial event attachment
        attachCardEventListeners();
    }

    function attachCardEventListeners() {
        document.querySelectorAll('.library-card').forEach(card => {
            // Favorite toggle
            const heartBtn = card.querySelector('.heart-icon');
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(card.dataset.id, heartBtn);
            });
            
            // Card click
            card.addEventListener('click', () => {
                openBookDetails(card.dataset.id);
            });
        });
    }

    function toggleFavorite(bookId, heartBtn) {
        const isFav = localStorage.getItem(`fav-${bookId}`);
        
        if (isFav) {
            localStorage.removeItem(`fav-${bookId}`);
            heartBtn.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            localStorage.setItem(`fav-${bookId}`, 'true');
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }

        // Visual feedback
        heartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => heartBtn.style.transform = '', 200);
    }

    function getFavoriteIconClass(bookId) {
        return localStorage.getItem(`fav-${bookId}`) ? 'fas fa-heart' : 'far fa-heart';
    }

    function switchTab(tab) {
        currentTab = tab;
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // In a real app, you would load different content for each tab
        console.log("Switched to tab:", tab);
        applyFilters();
    }

    function applyFilters() {
        const filterValue = filterSelect.value;
        
        let filteredBooks = [...libraryBooks];
        
        // Apply status filter
        if (filterValue !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.status === filterValue);
        }
        
        // Apply tab-based filtering
        if (currentTab === 'highlights') {
            // Filter for books with highlights
            filteredBooks = filteredBooks.filter(book => book.highlights?.length);
        } else if (currentTab === 'notes') {
            // Filter for books with notes
            filteredBooks = filteredBooks.filter(book => book.notes?.length);
        }
        
        renderBooks(filteredBooks);
    }

    function applySearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return applyFilters();
        
        const results = libraryBooks.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        
        renderBooks(results);
    }

    function openBookDetails(bookId) {
        // Implement your book detail view logic
        console.log("Opening book:", bookId);
        // window.location.href = `book.html?id=${bookId}`;
    }

    function showEmptyState() {
        libraryGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open fa-3x"></i>
                <h3>Your Library is Empty</h3>
                <p>Add books to your library to get started</p>
                <a href="discover.html" class="btn">Discover Books</a>
            </div>
        `;
    }
});