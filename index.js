document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    const notificationBtn = document.querySelector('.notification-btn');
    const settingsBtn = document.querySelector('.settings-btn');
    const genreFilter = document.querySelector('.filter-controls select');
    const viewAllBtn = document.querySelector('.view-all');
    const bookCards = document.querySelectorAll('.book-card');
    
    // Initialize favorite state from localStorage
    const initializeFavorites = () => {
        bookCards.forEach(card => {
            const heartIcon = card.querySelector('.heart-icon i');
            const bookId = card.dataset.id || card.querySelector('.book-title').textContent;
            
            if (localStorage.getItem(`fav-${bookId}`)) {
                heartIcon.classList.add('fas');
                heartIcon.classList.remove('far');
                heartIcon.style.color = '#ff6b81';
            }
        });
    };

    // Toggle favorite status
    const toggleFavorite = (e) => {
        e.stopPropagation();
        const heartIcon = e.currentTarget;
        const bookCard = heartIcon.closest('.book-card');
        const bookId = bookCard.dataset.id || bookCard.querySelector('.book-title').textContent;
        
        heartIcon.classList.toggle('fas');
        heartIcon.classList.toggle('far');
        
        if (heartIcon.classList.contains('fas')) {
            heartIcon.style.color = '#ff6b81';
            localStorage.setItem(`fav-${bookId}`, 'true');
        } else {
            heartIcon.style.color = '';
            localStorage.removeItem(`fav-${bookId}`);
        }
        
        // Animation
        heartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            heartIcon.style.transform = 'scale(1)';
        }, 300);
    };

    // Handle book card click
    const handleBookClick = (e) => {
        const card = e.currentTarget;
        const title = card.querySelector('.book-title').textContent;
        const author = card.querySelector('.book-author').textContent;
        
        // In a real app, this would open a modal with more details
        console.log(`Selected book: ${title} by ${author}`);
        alert(`Opening details for: ${title}`);
    };

    // Handle search
    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Searching for: ${query}`);
            // In a real app, filter or fetch matching books
            alert(`Search results for: ${query}`);
        }
    };

    // Handle genre filter
    const handleGenreFilter = () => {
        const selectedGenre = genreFilter.value;
        console.log(`Filtering by genre: ${selectedGenre}`);
        // In a real app, filter books by genre
    };

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    notificationBtn.addEventListener('click', () => {
        console.log('Notifications clicked');
        alert('Notifications panel would open');
    });

    settingsBtn.addEventListener('click', () => {
        console.log('Settings clicked');
        alert('Settings panel would open');
    });

    genreFilter.addEventListener('change', handleGenreFilter);
    viewAllBtn?.addEventListener('click', () => {
        console.log('View all clicked');
        alert('Showing all new releases');
    });

    bookCards.forEach(card => {
        card.addEventListener('click', handleBookClick);
        const heartIcon = card.querySelector('.heart-icon i');
        if (heartIcon) {
            heartIcon.addEventListener('click', toggleFavorite);
        }
    });

    // Initialize
    initializeFavorites();
    console.log('E-Library initialized');
});

// Fetch books data from JSON file
async function fetchBooks() {
    try {
        const response = await fetch('data.json'); // Path to your JSON file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.books; // Returns just the books array
    } catch (error) {
        console.error('Error fetching books:', error);
        return []; // Return empty array if there's an error
    }
}

// Usage example:
fetchBooks().then(books => {
    console.log('Fetched books:', books);
    renderBooks(books); // Function to display books in your HTML
});
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch data
    async function fetchData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to fetch data');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // Create modal element
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'book-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="modal-body">
                    <div class="book-cover">
                        <img src="" alt="Book cover">
                    </div>
                    <div class="book-details">
                        <h2 class="book-title"></h2>
                        <p class="book-author"></p>
                        <div class="book-meta">
                            <span class="rating"><i class="fas fa-star"></i> <span class="rating-value"></span></span>
                            <span class="genre"></span>
                            <span class="pages"></span>
                        </div>
                        <div class="book-description">
                            <h3>Description</h3>
                            <p></p>
                        </div>
                        <div class="action-buttons">
                            <button class="read-btn">Start Reading</button>
                            <button class="favorite-btn"><i class="far fa-heart"></i> Favorite</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Show modal with book details
    function showBookDetails(book) {
        const modal = document.querySelector('.book-modal') || createModal();
        
        // Populate modal with book data
        modal.querySelector('.book-cover img').src = book.cover;
        modal.querySelector('.book-cover img').alt = book.title;
        modal.querySelector('.book-title').textContent = book.title;
        modal.querySelector('.book-author').textContent = `by ${book.author}`;
        modal.querySelector('.rating-value').textContent = book.rating;
        modal.querySelector('.genre').textContent = book.genre;
        modal.querySelector('.pages').textContent = `${book.pages} pages`;
        modal.querySelector('.book-description p').textContent = book.description;
        
        // Set favorite button state
        const favBtn = modal.querySelector('.favorite-btn i');
        if (localStorage.getItem(`fav-${book.id}`)) {
            favBtn.classList.add('fas');
            favBtn.classList.remove('far');
        } else {
            favBtn.classList.add('far');
            favBtn.classList.remove('fas');
        }
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking overlay or X button
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        
        // Favorite button functionality
        modal.querySelector('.favorite-btn').addEventListener('click', () => {
            const isFav = !localStorage.getItem(`fav-${book.id}`);
            localStorage.setItem(`fav-${book.id}`, isFav.toString());
            favBtn.classList.toggle('fas', isFav);
            favBtn.classList.toggle('far', !isFav);
        });
        
        // Read button functionality
        modal.querySelector('.read-btn').addEventListener('click', () => {
            alert(`Opening "${book.title}" for reading...`);
            closeModal();
        });
    }

    function closeModal() {
        const modal = document.querySelector('.book-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Render books to the page
    function renderBooks(books) {
        const booksGrid = document.querySelector('.books-grid');
        if (!booksGrid) return;

        booksGrid.innerHTML = books.map(book => `
            <div class="book-card" data-id="${book.id}">
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}">
                    <div class="heart-icon">
                        <i class="${localStorage.getItem(`fav-${book.id}`) ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span class="rating"><i class="fas fa-star"></i> ${book.rating}</span>
                        <span class="genre">${book.genre}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach event listeners
        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.heart-icon')) {
                    const bookId = parseInt(card.dataset.id);
                    const book = books.find(b => b.id === bookId);
                    if (book) showBookDetails(book);
                }
            });

            const heartIcon = card.querySelector('.heart-icon i');
            if (heartIcon) {
                heartIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const bookId = card.dataset.id;
                    const isFav = !localStorage.getItem(`fav-${bookId}`);
                    localStorage.setItem(`fav-${bookId}`, isFav.toString());
                    heartIcon.classList.toggle('fas', isFav);
                    heartIcon.classList.toggle('far', !isFav);
                });
            }
        });
    }

    // Initialize the app
    const data = await fetchData();
    if (data) {
        renderBooks(data.books);
    }
});
// In your toggleFavorite function:
localStorage.setItem(`fav-${bookId}`, 'true'); // When favoriting
localStorage.removeItem(`fav-${bookId}`); // When unfavoriting
// Handle favorite clicks
document.querySelectorAll('.heart-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = this.closest('.book-card').dataset.id;
      const heart = this.querySelector('i');
      
      // Toggle favorite state
      if (heart.classList.contains('far')) {
        heart.classList.remove('far');
        heart.classList.add('fas');
        localStorage.setItem(`fav-${bookId}`, 'true');
      } else {
        heart.classList.remove('fas');
        heart.classList.add('far');
        localStorage.removeItem(`fav-${bookId}`);
      }
    });
  });
  
  // Initialize heart icons on page load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.book-card').forEach(card => {
      const bookId = card.dataset.id;
      const heart = card.querySelector('.heart-icon i');
      
      if (localStorage.getItem(`fav-${bookId}`)) {
        heart.classList.remove('far');
        heart.classList.add('fas');
      }
    });
  });