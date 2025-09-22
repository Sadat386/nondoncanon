import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin-login.html';
    return;
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
      const res = await fetch(`${API_URL}/admin/products`, { headers });
      const products = await res.json();

      productsTableBody.innerHTML = '';
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="py-2 px-4 border-b">${product.name}</td>
          <td class="py-2 px-4 border-b">${product.price}</td>
          <td class="py-2 px-4 border-b">${product.stock}</td>
          <td class="py-2 px-4 border-b">
            <button class="bg-blue-500 text-white px-2 py-1 rounded-md edit-btn" data-id="${product._id}">Edit</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded-md delete-btn" data-id="${product._id}">Delete</button>
          </td>
        `;
        productsTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers });
      const users = await res.json();

      usersTableBody.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="py-2 px-4 border-b">${user.name}</td>
          <td class="py-2 px-4 border-b">${user.email}</td>
          <td class="py-2 px-4 border-b">${user.role}</td>
        `;
        usersTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { headers });
      const orders = await res.json();

      ordersTableBody.innerHTML = '';
      orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="py-2 px-4 border-b">${order._id}</td>
          <td class="py-2 px-4 border-b">${order.user ? order.user.name : 'N/A'}</td>
          <td class="py-2 px-4 border-b">${order.totalPrice}</td>
          <td class="py-2 px-4 border-b">${order.status}</td>
        `;
        ordersTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleTabClick = (e) => {
    productsContent.classList.add('hidden');
    usersContent.classList.add('hidden');
    ordersContent.classList.add('hidden');

    if (e.target.id === 'products-tab') {
      productsContent.classList.remove('hidden');
      fetchProducts();
    } else if (e.target.id === 'users-tab') {
      usersContent.classList.remove('hidden');
      fetchUsers();
    } else if (e.target.id === 'orders-tab') {
      ordersContent.classList.remove('hidden');
      fetchOrders();
    }
  };

  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const discount = document.getElementById('discount').value;
    const imageUrls = document.getElementById('imageUrls').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;

    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, description, price, discount, imageUrls, stock, category, subcategory }),
      });

      if (res.ok) {
        fetchProducts();
        addProductForm.reset();
      } else {
        const errorData = await res.json();
        console.error('Error adding product:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  });

  productsTableBody.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.dataset.id;
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const { data: product } = await res.json();

        if (product) {
          editProductId.value = product._id;
          editName.value = product.name;
          editDescription.value = product.description;
          editPrice.value = product.price;
          editDiscount.value = product.discountPrice;
          editImageUrls.value = product.imageUrls ? product.imageUrls.join(', ') : '';
          editStock.value = product.stock;
          editCategory.value = product.category;
          editSubcategory.value = product.subcategory;

          editModal.classList.remove('hidden');
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product for edit:', error);
      }
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const res = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers,
          });

          if (res.ok) {
            fetchProducts();
          } else {
            const errorData = await res.json();
            console.error('Error deleting product:', errorData.message);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    }
  });

  editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editProductId.value;
    const updatedProduct = {
      name: editName.value,
      description: editDescription.value,
      price: editPrice.value,
      discount: editDiscount.value,
      imageUrls: editImageUrls.value,
      stock: editStock.value,
      category: editCategory.value,
      subcategory: editSubcategory.value,
    };

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        fetchProducts();
        editModal.classList.add('hidden');
      } else {
        const errorData = await res.json();
        console.error('Error updating product:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  });

  closeModalBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
  });

  // Initial fetch
  fetchProducts();

  // Tab event listeners
  productsTab.addEventListener('click', handleTabClick);
  usersTab.addEventListener('click', handleTabClick);
  ordersTab.addEventListener('click', handleTabClick);
});
