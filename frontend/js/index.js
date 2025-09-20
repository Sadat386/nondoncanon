import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-list');
  const featuredProductContainer = document.getElementById('featured-product-list');
  const topDiscountContainer = document.getElementById('top-discount-product-card-container');

  const displayTopDiscountProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/products/top-discounted`);
      if (!response.ok) throw new Error('Product not found');
      const { data: product } = await response.json();

      const discount = (product.discountPrice && product.discountPrice < product.price) 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

      topDiscountContainer.innerHTML = `
        <a href="product.html?id=${product._id}" class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 block w-full max-w-sm relative animate-pulse ring-4 ring-yellow-400 shadow-lg">
          ${discount > 0 ? `<div class="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-3 py-1 m-2 rounded-full z-10">${discount}% OFF</div>` : ''}
          <img src="${(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/150'}" alt="${product.name}" class="w-full h-80 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
            <div class="flex items-center justify-between mt-2">
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
      `;
    } catch (error) {
      topDiscountContainer.innerHTML = '<p class="text-gray-600">No special discounts at the moment.</p>';
    }
  };

  const displayProducts = async (container, url) => {
    try {
      const response = await fetch(url);
      const { data: products } = await response.json();

      if (products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
      }

      container.innerHTML = products.map(product => `
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
      container.innerHTML = '<p class="text-red-500">Error fetching products. Please try again later.</p>';
    }
  };

  displayTopDiscountProduct();
  displayProducts(productContainer, `${API_URL}/products?sort=-createdAt&limit=4`);
  displayProducts(featuredProductContainer, `${API_URL}/products/featured`);
});