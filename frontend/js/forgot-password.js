import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordForm = document.querySelector('#forgot-password-form');

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;

      try {
        const response = await fetch(`${API_URL}/auth/forgotpassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.message || 'Something went wrong');
        }
      } catch (error) {
        alert('Error during forgot password request.');
      }
    });
  }
});