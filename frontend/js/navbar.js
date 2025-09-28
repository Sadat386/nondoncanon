import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  updateCartCount();
});


export const updateCartCount = async () => {
  const token = localStorage.getItem('token');
  const cartCount = document.getElementById('cart-item-count');

  if (!cartCount) return;

  if (!token) {
    cartCount.textContent = '0';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const { data: items } = await response.json();
      cartCount.textContent = items.length;
    } else {
      cartCount.textContent = '0';
    }
  } catch (error) {
    cartCount.textContent = '0';
  }
};