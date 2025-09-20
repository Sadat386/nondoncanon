import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const resetPasswordForm = document.querySelector('#reset-password-form');

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirm-password').value;

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/resetpassword/${token}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          window.location.href = 'login.html';
        } else {
          alert(data.message || 'Something went wrong');
        }
      } catch (error) {
        alert('Error during password reset.');
      }
    });
  }
});