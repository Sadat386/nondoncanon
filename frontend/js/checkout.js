import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.querySelector('#checkout-form');

  const ORDERS_URL = `${API_URL}/orders`;

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/html/login.html';
        return;
      }

      const fullName = document.querySelector('#fullName').value;
      const phone = document.querySelector('#phone').value;
      const alternatePhone = document.querySelector('#alternatePhone').value;
      const email = document.querySelector('#email').value;
      const street = document.querySelector('#street').value;
      const city = document.querySelector('#city').value;
      const district = document.querySelector('#district').value;
      const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
      const additionalInstructions = document.querySelector('#instructions').value;

      // For now, paymentMethod is hardcoded. You would integrate a payment gateway here.
      const paymentMethod = 'Cash on Delivery';

      try {
        const response = await fetch(ORDERS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            shippingInfo: { fullName, phone, alternatePhone, email, street, city, district },
            deliveryOption,
            additionalInstructions,
            paymentMethod,
          }),
        });

        if (response.ok) {
          alert('Order placed successfully!');
          window.location.href = 'orders.html';
        } else {
          alert('Failed to place order.');
        }
      } catch (error) {
        alert('Error placing order.');
      }
    });
  }
});