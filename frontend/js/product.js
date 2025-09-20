import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const productDetailsContainer = document.getElementById('product-details');
  const reviewsContainer = document.getElementById('reviews-container');
  const addReviewForm = document.getElementById('add-review-form');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const getProductDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);
      const { data: product } = await response.json();

      // --- Image Gallery Logic ---
      const imageGallery = document.getElementById('image-gallery');
      const mainImage = document.getElementById('main-image');
      const thumbnailGallery = document.getElementById('thumbnail-gallery');

      // Set the main image to the first URL
      if (product.imageUrls && product.imageUrls.length > 0) {
        mainImage.src = product.imageUrls[0];
      } else {
        mainImage.src = 'https://via.placeholder.com/300';
      }

      // Create thumbnails
      thumbnailGallery.innerHTML = product.imageUrls.map(url => `
        <img src="${url}" alt="Product thumbnail" class="w-full h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-accent">
      `).join('');

      // Handle thumbnail clicks
      thumbnailGallery.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
          mainImage.src = e.target.src;
        }
      });

      // --- Product Info Logic ---
      const productInfoContainer = document.createElement('div');
      productInfoContainer.innerHTML = `
        <h1 class="text-3xl font-bold text-primary mb-4">${product.name}</h1>
        <div class="flex items-center mb-4">
          <span class="text-yellow-500">${'&#9733;'.repeat(Math.round(product.rating || 0))}</span>
          <span class="text-gray-600 ml-2">(${product.numOfReviews || 0} reviews)</span>
        </div>
        <p class="text-gray-700 mb-4">${product.description}</p>
        <p class="text-gray-700 mb-4">Status: ${product.stock > 0 ? 'Available' : 'Out of Stock'}</p>
        <div class="text-2xl font-bold text-primary mb-4">
          ${product.discountPrice && product.discountPrice < product.price
            ? `<span class="text-red-500"><del class="text-gray-500">${product.price} Taka</del> > ${product.discountPrice} Taka</span>`
            : `<span>${product.price} Taka</span>`
          }
        </div>
        <button data-id="${product._id}" class="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-opacity-80 add-to-cart-btn">Add to Cart</button>
        <button data-id="${product._id}" class="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 add-to-wishlist-btn mt-4">Add to Wishlist</button>
      `;
      // The product details container is a grid, so we append the info to the second column
      productDetailsContainer.appendChild(productInfoContainer);

    } catch (error) {
      productDetailsContainer.innerHTML = '<p class="text-red-500">Error fetching product details. Please try again later.</p>';
    }
  };

  const getReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/reviews`);
      const { data: reviews } = await response.json();

      if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
        return;
      }

      reviewsContainer.innerHTML = reviews.map(review => `
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-2">
            <span class="text-yellow-500">${'&#9733;'.repeat(review.rating)}</span>
            <span class="text-gray-600 ml-2">- ${new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <p class="text-gray-700">${review.comment}</p>
        </div>
      `).join('');
    } catch (error) {
      reviewsContainer.innerHTML = '<p class="text-red-500">Error fetching reviews. Please try again later.</p>';
    }
  };

  productDetailsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = e.target.dataset.id;
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity: 1 })
        });

        if (res.ok) {
          alert('Product added to cart');
        } else {
          const error = await res.json();
          alert(error.message);
        }
      } catch (error) {
        alert('Error adding to cart');
      }
    }
    if (e.target.classList.contains('add-to-wishlist-btn')) {
      const productId = e.target.dataset.id;
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to your wishlist.');
        window.location.href = 'login.html';
        return;
      }

      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });

        if (res.ok) {
          alert('Product added to wishlist');
        } else {
          const error = await res.json();
          alert(error.message);
        }
      } catch (error) {
        alert('Error adding to wishlist');
      }
    }
  });

  addReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to write a review.');
      window.location.href = 'login.html';
      return;
    }

    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    try {
      const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        getReviews();
        getProductDetails();
        addReviewForm.reset();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  });

  getProductDetails();
  getReviews();
});