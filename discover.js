// discover.js - Standalone implementation for Discover page

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const discoverGrid = document.getElementById('discover-grid');
    const genreFilter = document.getElementById('genre-filter');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    
    // Book data
    let books = [];
    
    // Initialize page
    initDiscoverPage();

    async function initDiscoverPage() {
        try {
            books = await fetchBooks();
            renderBooks(books);
            setupEventListeners();
        } catch (error) {
            console.error("Failed to initialize:", error);
            showEmptyState();
        }
    }

    // Data fetching (replace with your actual data source)
    async function fetchBooks() {
        // Example: Fetch from JSON API
        // const response = await fetch('/api/books');
        // return await response.json();
        
        // Mock data - remove in production
        return [
            {
                id: 1,
                title: "The Silent Patient",
                author: "Alex Michaelides",
                cover: "https://m.media-amazon.com/images/I/61R+Cpm+HxL._AC_UF894,1000_QL80_.jpg",
                genre: "thriller",
                rating: 4.7,
                year: 2019,
                popularity: 95
            },
            {
                id: 2, 
                title: "It Ends With Us",
                author: "Colleen Hoover",
                cover: "https://cdnattic.atticbooks.co.ke/img/U344316.jpg",
                genre: "romance",
                rating: 4.8,
                year: 2016,
                popularity: 98
            }
        ];
    }

    function renderBooks(booksToRender) {
        if (!booksToRender?.length) {
            showEmptyState();
            return;
        }

        discoverGrid.innerHTML = booksToRender.map(book => `
            <div class="book-card" data-id="${book.id}" data-genre="${book.genre}">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}">
                    <button class="heart-icon" aria-label="Toggle favorite">
                        <i class="${getFavoriteIconClass(book.id)}"></i>
                    </button>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="rating"><i class="fas fa-star"></i> ${book.rating}</span>
                        <span class="genre-tag">${book.genre}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach event listeners to new elements
        attachEventListeners();
    }

    function setupEventListeners() {
        // Filter/sort controls
        genreFilter.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applyFilters);
        
        // Search functionality
        searchBtn.addEventListener('click', applySearch);
        searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && applySearch());
        
        // Initial event attachment
        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.book-card').forEach(card => {
            // Favorite toggle
            const heartBtn = card.querySelector('.heart-icon');
            heartBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(card.dataset.id, heartBtn);
            });

            // Book click
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

    function applyFilters() {
        const genre = genreFilter.value;
        const sortMethod = sortBy.value;
        
        let filteredBooks = [...books];

        // Genre filter
        if (genre !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.genre === genre);
        }

        // Sorting
        filteredBooks.sort((a, b) => {
            switch (sortMethod) {
                case 'newest': return b.year - a.year;
                case 'rating': return b.rating - a.rating;
                default: return b.popularity - a.popularity; // 'popular'
            }
        });

        renderBooks(filteredBooks);
    }

    function applySearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return applyFilters();
        
        const results = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        
        renderBooks(results);
    }

    function openBookDetails(bookId) {
        // Implement your book detail view logic here
        console.log("Viewing book:", bookId);
        // window.location.href = `book.html?id=${bookId}`;
    }

    function showEmptyState() {
        discoverGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No Books Found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
    }
});