import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const logoutButton = document.querySelector('#logout-btn');
  const loginLink = document.querySelector('#login-link');
  const userGreeting = document.querySelector('#user-greeting');

  // Mobile menu elements
  const mobileLogoutButton = document.querySelector('#mobile-logout-btn');
  const mobileLoginLink = document.querySelector('#mobile-login-link');
  const mobileUserGreeting = document.querySelector('#mobile-user-greeting');

  const AUTH_URL = `${API_URL}/auth`;

  const updateUI = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (token && name) {
      // User is logged in
      if (loginLink) loginLink.classList.add('hidden');
      if (logoutButton) logoutButton.classList.remove('hidden');
      if (userGreeting) {
        userGreeting.textContent = `Welcome, ${name}`;
      }
      // Mobile menu
      if (mobileLoginLink) mobileLoginLink.classList.add('hidden');
      if (mobileLogoutButton) mobileLogoutButton.classList.remove('hidden');
      if (mobileUserGreeting) {
        mobileUserGreeting.textContent = `Welcome, ${name}`;
      }
    } else {
      // User is logged out
      if (loginLink) loginLink.classList.remove('hidden');
      if (logoutButton) logoutButton.classList.add('hidden');
      if (userGreeting) userGreeting.textContent = '';
      // Mobile menu
      if (mobileLoginLink) mobileLoginLink.classList.remove('hidden');
      if (mobileLogoutButton) mobileLogoutButton.classList.add('hidden');
      if (mobileUserGreeting) mobileUserGreeting.textContent = '';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    window.location.href = 'index.html';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.querySelector('#login-email').value;
      const password = document.querySelector('#login-password').value;

      try {
        const response = await fetch(`${AUTH_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('name', data.name);
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        alert('An error occurred during login.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('#register-name').value;
      const email = document.querySelector('#register-email').value;
      const password = document.querySelector('#register-password').value;

      try {
        const response = await fetch(`${AUTH_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('name', data.name);
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        alert('Registration failed');
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }

  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener('click', logout);
  }

  updateUI();
});