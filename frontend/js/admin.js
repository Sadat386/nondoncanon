import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin-login.html'; // <-- FIXED
    return; // stop executing the rest
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Tabs
  const productsTab = document.getElementById('products-tab');
  const usersTab = document.getElementById('users-tab');
  const ordersTab = document.getElementById('orders-tab');

  const productsContent = document.getElementById('products-content');
  const usersContent = document.getElementById('users-content');
  const ordersContent = document.getElementById('orders-content');

  // Tables and forms
  const productsTableBody = document.getElementById('products-table-body');
  const usersTableBody = document.getElementById('users-table-body');
  const ordersTableBody = document.getElementById('orders-table-body');
  const addProductForm = document.getElementById('add-product-form');

  // Edit modal
  const editModal = document.getElementById('edit-product-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const editProductForm = document.getElementById('edit-product-form');
  const editProductId = document.getElementById('edit-product-id');
  const editName = document.getElementById('edit-name');
  const editDescription = document.getElementById('edit-description');
  const editPrice = document.getElementById('edit-price');
  const editDiscount = document.getElementById('edit-discount');
  const editImageUrls = document.getElementById('edit-imageUrls');
  const editStock = document.getElementById('edit-stock');
  const editCategory = document.getElementById('edit-category');
  const editSubcategory = document.getElementById('edit-subcategory');

  const logoutBtn = document.getElementById('logout-btn');

  // ------------------ Functions ------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products`, { head_
