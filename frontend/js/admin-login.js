import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Clear previous error
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);

        // Redirect to admin dashboard
        window.location.href = '/admin.html'; // <-- FIXED
      } else {
        // Show backend error message
        errorMessage.textContent = data.message || 'Login failed';
        errorMessage.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = 'Server error. Please try again later.';
      errorMessage.classList.remove('hidden');
    }
  });
});
