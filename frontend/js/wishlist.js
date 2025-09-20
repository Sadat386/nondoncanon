import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const wishlistItemsContainer = document.querySelector('#wishlist-items');
  const token = localStorage.getItem('token');

  const getWishlistItems = async () => {
    if (!token) {
      wishlistItemsContainer.innerHTML = '<p>Please log in to see your wishlist.</p>';
      console.log('No token found, returning empty wishlist.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { data: items } = await response.json();
      console.log('Wishlist items data from backend:', items);

      if (items.length === 0) {
        wishlistItemsContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        console.log('Wishlist is empty.');
        return;
      }

      wishlistItemsContainer.innerHTML = items.map(item => `
        <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center">
            <img src="${item.imageUrls[0] || 'https://via.placeholder.com/100'}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md mr-4">
            <div>
              <a href="product.html?id=${item._id}" class="text-lg font-bold text-primary hover:underline">${item.name}</a>
              <p class="text-gray-600">${item.price} Taka</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="bg-accent text-white px-3 py-1 rounded-md hover:bg-opacity-80 add-to-cart-btn" data-product-id="${item._id}">Add to Cart</button>
            <button class="text-red-500 hover:text-red-700 remove-from-wishlist-btn" data-product-id="${item._id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      wishlistItemsContainer.innerHTML = '<p class="text-red-500">Error fetching wishlist. Please try again later.</p>';
      console.error('Error fetching wishlist items:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Item removed from wishlist!');
        getWishlistItems();
      } else {
        alert('Failed to remove item from wishlist.');
      }
    } catch (error) {
      alert('Error removing item from wishlist.');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert('Please log in to add items to your cart.');
      window.location.href = 'login.html';
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (res.ok) {
        alert('Product added to cart!');
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error adding to cart.');
    }
  };

  wishlistItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-from-wishlist-btn')) {
      const productId = e.target.closest('.remove-from-wishlist-btn').dataset.productId;
      handleRemoveItem(productId);
    }
    if (e.target.closest('.add-to-cart-btn')) {
      const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
      handleAddToCart(productId);
    }
  });

  getWishlistItems();
});