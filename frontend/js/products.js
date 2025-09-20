import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-list');
  const categoryLinks = document.querySelectorAll('aside a[data-category]');
  const ratingFilters = document.querySelectorAll('aside input[type="checkbox"]');
  const sortBy = document.getElementById('sort-by');

  let filters = {
    category: '',
    subcategory: '',
    rating: '',
    sort: ''
  };

  const getProducts = async () => {
    try {
      let apiUrl = `${API_URL}/products?`;
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.rating) params.append('rating[gte]', filters.rating);
      if (filters.sort) params.append('sort', filters.sort);

      apiUrl += params.toString();

      const response = await fetch(apiUrl);
      const { data: products } = await response.json();

      if (products.length === 0) {
        productContainer.innerHTML = '<p>No products found.</p>';
        return;
      }

      productContainer.innerHTML = products.map(product => `
        <a href="product.html?id=${product._id}" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 block">
          <img src="${(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/150'}" alt="${product.name}" class="w-full h-64 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
            <p class="text-gray-600 text-sm mt-2">Stock: ${product.stock > 0 ? 'Available' : 'Out of Stock'}</p>
            <div class="flex items-center justify-between mt-4">
              <div>
                ${product.discountPrice && product.discountPrice < product.price
                  ? `<span class="text-xl font-bold text-red-500"><del class="text-gray-500">${product.price} Taka</del> > ${product.discountPrice} Taka</span>`
                  : `<span class="text-xl font-bold text-gray-800">${product.price} Taka</span>`
                }
              </div>
              <div class="flex items-center">
                <span class="text-yellow-500">${'&#9733;'.repeat(Math.round(product.rating || 0))}</span>
                <span class="text-gray-600 ml-2">(${product.numOfReviews || 0})</span>
              </div>
            </div>
          </div>
        </a>
      `).join('');
    } catch (error) {
      productContainer.innerHTML = '<p class="text-red-500">Error fetching products. Please try again later.</p>';
    }
  };

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filters.category = e.target.dataset.category || '';
      filters.subcategory = e.target.dataset.subcategory || '';
      getProducts();
    });
  });

  ratingFilters.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const checkedRatings = [...ratingFilters].filter(i => i.checked);
      if (checkedRatings.length > 0) {
        filters.rating = Math.min(...checkedRatings.map(r => parseInt(r.id.split('-')[0])));
      } else {
        filters.rating = '';
      }
      getProducts();
    });
  });

  sortBy.addEventListener('change', () => {
    filters.sort = sortBy.value;
    getProducts();
  });

  getProducts(); // Initial load
});