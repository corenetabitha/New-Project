document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const clearFavoritesBtn = document.getElementById('clear-favorites');

    // Load and display favorite books
    function loadFavorites() {
        // Get all keys from localStorage that start with 'fav-'
        const favoriteKeys = Object.keys(localStorage).filter(key => key.startsWith('fav-'));
        
        if (favoriteKeys.length === 0) {
            // Show empty state if no favorites
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>You haven't favorited any books yet</p>
                    <a href="index.html" class="btn">Browse Books</a>
                </div>
            `;
            return;
        }

        // Clear existing content
        favoritesContainer.innerHTML = '';

        // Fetch book data (from your main data.json)
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                favoriteKeys.forEach(key => {
                    const bookId = key.replace('fav-', '');
                    const book = data.books.find(b => b.id == bookId);
                    
                    if (book) {
                        const bookCard = createFavoriteCard(book);
                        favoritesContainer.appendChild(bookCard);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading favorites:', error);
                favoritesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading favorites. Please try again.</p>
                    </div>
                `;
            });
    }

    // Create HTML for a favorite book card
    function createFavoriteCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;
        
        card.innerHTML = `
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}">
                <div class="heart-icon">
                    <i class="fas fa-heart"></i>
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
        `;
        
        // Add click event to remove from favorites
        const heartIcon = card.querySelector('.heart-icon i');
        heartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.removeItem(`fav-${book.id}`);
            card.remove();
            
            // Show empty state if no favorites left
            if (favoritesContainer.children.length === 0) {
                loadFavorites();
            }
        });
        
        return card;
    }

    // Clear all favorites
    clearFavoritesBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all favorites?')) {
            // Remove all fav- keys from localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('fav-')) {
                    localStorage.removeItem(key);
                }
            });
            loadFavorites(); // Refresh the display
        }
    });

    // Initial load
    loadFavorites();
});