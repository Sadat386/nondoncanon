import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('#cart-items');
  const token = localStorage.getItem('token');

  const getCartItems = async (token) => {
    if (!token) {
      console.log('No token found, returning empty cart.');
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { data } = await response.json();
      console.log('Cart items data from backend:', data); // Log data from backend
      return data;
    } catch (error) {
      console.error('Error fetching cart items:', error); // Log error
      return [];
    }
  };

  const renderCartItems = (items) => {
    console.log('Items to render:', items); // Log items array
    if (items.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = items.map(item => {
      if (!item.product) { // Add this check
        console.warn('Product not found for item:', item);
        return ''; // Skip rendering this item
      }
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;
      return `
      <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div class="flex items-center">
          <img src="${item.product.imageUrls[0] || 'https://via.placeholder.com/100'}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded-md mr-4">
          <div>
            <h3 class="text-lg font-bold">${item.product.name}</h3>
            <p class="text-gray-600">${item.product.price} x ${item.quantity}</p>
          </div>
        </div>
        <button class="text-red-500 hover:text-red-700 remove-item-button" data-product-id="${item.product._id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    }).join('');

    document.querySelector('#cart-total').textContent = `${total.toFixed(2)} Taka`;
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Item removed from cart!');
        const items = await getCartItems(token);
        renderCartItems(items);
      } else {
        alert('Failed to remove item from cart.');
      }
    } catch (error) {
      alert('Error removing item from cart.');
    }
  };

  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-button')) {
      const productId = e.target.closest('.remove-item-button').dataset.productId;
      handleRemoveItem(productId);
    }
  });

  const initCart = async () => {
    if (!token) {
      cartItemsContainer.innerHTML = '<p>Please log in to see your cart.</p>';
      return;
    }
    const items = await getCartItems(token);
    renderCartItems(items);
  };

  initCart();
});