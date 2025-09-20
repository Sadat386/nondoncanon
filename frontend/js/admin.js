import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'admin-login.html';
  }

  const productsTab = document.getElementById('products-tab');
  const usersTab = document.getElementById('users-tab');
  const ordersTab = document.getElementById('orders-tab');

  const productsContent = document.getElementById('products-content');
  const usersContent = document.getElementById('users-content');
  const ordersContent = document.getElementById('orders-content');

  const addProductForm = document.getElementById('add-product-form');
  const productsTableBody = document.getElementById('products-table-body');
  const usersTableBody = document.getElementById('users-table-body');
  const ordersTableBody = document.getElementById('orders-table-body');

  // Edit Modal Elements
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

  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products`, { headers });
      const products = await res.json();
      productsTableBody.innerHTML = products.map(product => `
        <tr class="border-b">
          <td class="py-3 px-2 flex items-center">
            <img src="${(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/40'}" alt="${product.name}" class="w-10 h-10 object-cover rounded-md mr-4">
            <span class="font-medium">${product.name}</span>
          </td>
          <td class="py-3 px-2">${product.price} Taka</td>
          <td class="py-3 px-2">${product.stock}</td>
          <td class="py-3 px-2 space-x-4">
            <button class="font-medium text-blue-600 hover:text-blue-800 edit-btn" data-id="${product._id}">Edit</button>
            <button class="font-medium text-red-600 hover:text-red-800 delete-btn" data-id="${product._id}">Delete</button>
          </td>
        </tr>
      `).join('');
    } catch (error) {
      console.error("Failed to fetch products:", error);
      productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Failed to load products.</td></tr>';
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers });
      const users = await res.json();
      usersTableBody.innerHTML = users.map(user => `
        <tr>
          <td class="py-2">${user.name}</td>
          <td class="py-2">${user.email}</td>
          <td class="py-2">${user.role}</td>
        </tr>
      `).join('');
    } catch (error) {
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { headers });
      const orders = await res.json();
      ordersTableBody.innerHTML = orders.map(order => `
        <tr>
          <td class="py-2">${order._id}</td>
          <td class="py-2">${order.user.name}</td>
          <td class="py-2">${order.totalPrice}</td>
          <td class="py-2">${order.isPaid ? 'Yes' : 'No'}</td>
        </tr>
      `).join('');
    } catch (error) {
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

    const productData = {
      name,
      description,
      price,
      discount,
      imageUrls: imageUrls, // Send the comma-separated string
      stock,
      category,
      subcategory,
    };

    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        fetchProducts();
        addProductForm.reset();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
    }
  });

  productsTableBody.addEventListener('click', async (e) => {
    // Handle Delete Button
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const res = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers,
          });
          if (res.ok) {
            fetchProducts();
          } else {
            const error = await res.json();
            alert(error.message);
          }
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    }

    // Handle Edit Button
    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`${API_URL}/products/${id}`, { headers });
        const { data: product } = await res.json();
        
        editProductId.value = product._id;
        editName.value = product.name;
        editDescription.value = product.description;
        editPrice.value = product.price;
        editDiscount.value = product.discountPrice || '';
        editImageUrls.value = product.imageUrls.join(', ');
        editStock.value = product.stock;
        editCategory.value = product.category;
        editSubcategory.value = product.subcategory || '';

        editModal.classList.remove('hidden');
      } catch (error) {
        console.error('Failed to fetch product for edit:', error);
      }
    }
  });

  // Handle Edit Form Submission
  editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editProductId.value;
    const updatedData = {
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
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        editModal.classList.add('hidden');
        fetchProducts();
      } else {
        const error = await res.json();
        alert(`Update failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Update submission failed:', error);
    }
  });

  // Close Modal Logic
  closeModalBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
  });

  productsTab.addEventListener('click', () => {
    productsContent.classList.remove('hidden');
    usersContent.classList.add('hidden');
    ordersContent.classList.add('hidden');
  });

  usersTab.addEventListener('click', () => {
    productsContent.classList.add('hidden');
    usersContent.classList.remove('hidden');
    ordersContent.classList.add('hidden');
    fetchUsers();
  });

  ordersTab.addEventListener('click', () => {
    productsContent.classList.add('hidden');
    usersContent.classList.add('hidden');
    ordersContent.classList.remove('hidden');
    fetchOrders();
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
  });

  // Initial fetch
  fetchProducts();
});