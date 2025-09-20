import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const ordersList = document.querySelector('#orders-list');

  const ORDERS_URL = `${API_URL}/orders/myorders`;

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      ordersList.innerHTML = '<p class="no-orders-message">Please log in to view your orders.</p>';
      return;
    }

    try {
      const response = await fetch(ORDERS_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const orders = await response.json();
        if (orders.length === 0) {
          ordersList.innerHTML = '<p class="no-orders-message">No orders found.</p>';
        } else {
          ordersList.innerHTML = orders.map(order => `
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Order ID: ${order._id}</h3>
                <span class="text-gray-600">${new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="space-y-4">
                ${order.orderItems.map(item => `
                  <div class="flex items-center">
                    <img src="${(item.product.imageUrls && item.product.imageUrls.length > 0) ? item.product.imageUrls[0] : 'https://via.placeholder.com/100'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4">
                    <div>
                      <a href="product.html?id=${item.product._id}" class="text-lg font-bold text-primary hover:underline">${item.name}</a>
                      <p class="text-gray-600">${item.price} Taka x ${item.quantity}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="text-right mt-4">
                <span class="text-xl font-bold text-primary">Total: ${order.totalPrice} Taka</span>
              </div>
            </div>
          `).join('');
        }
      } else {
        ordersList.innerHTML = '<p class="error-message">Failed to fetch orders.</p>';
      }
    } catch (error) {
      ordersList.innerHTML = '<p class="error-message">Error fetching orders.</p>';
    }
  };

  fetchOrders();
});