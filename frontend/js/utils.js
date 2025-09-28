import { API_URL } from './config.js';
import { showNotification } from './notification.js';

export const addToCart = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    showNotification('Please log in to add items to your cart.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (response.ok) {
      showNotification('Item added to cart successfully!', 'success');
    } else {
      const { message } = await response.json();
      showNotification(message || 'Failed to add item to cart.', 'error');
    }
  } catch (error) {
    showNotification('Error adding item to cart.', 'error');
  }
};

export const addToWishlist = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    showNotification('Please log in to add items to your wishlist.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });

    if (response.ok) {
      showNotification('Item added to wishlist successfully!', 'success');
    } else {
      const { message } = await response.json();
      showNotification(message || 'Failed to add item to wishlist.', 'error');
    }
  } catch (error) {
    showNotification('Error adding item to wishlist.', 'error');
  }
};
