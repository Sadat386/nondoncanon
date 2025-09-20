import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = 'admin.html';
      } else {
        errorMessage.textContent = data.message;
        errorMessage.classList.remove('hidden');
      }
    } catch (error) {
      errorMessage.textContent = 'Server error';
      errorMessage.classList.remove('hidden');
    }
  });
});
