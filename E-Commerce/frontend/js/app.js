// --- AUTHENTICATION & SESSION GUARDS ---
if (!localStorage.getItem('ecommerce_userId')) { 
    window.location.href = 'login.html'; 
}

function logout() {
    localStorage.removeItem('ecommerce_userId');
    localStorage.removeItem('ecommerce_cart');
    localStorage.removeItem('ecommerce_token');
    window.location.href = 'login.html';
}

// --- GLOBAL APP INITIALIZATION STATE ---
let allProducts = []; // Save products here globally so we can filter them
const API_URL = 'https://code-alpha-e-commerce.onrender.com/api';

// --- DATA LAYER: BACKEND FETCHING ---
async function fetchProducts() {
    try {
        // Corrected asynchronous operational sequence
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        renderProducts(allProducts); // Show all items initially
    } catch (error) {
        console.error("❌ UI Render Execution Failure:", error);
        const listContainer = document.getElementById('product-list');
        if (listContainer) {
            listContainer.innerHTML = '<h3 style="color:red; text-align:center; width:100%;">Error connecting to server.</h3>';
        }
    }
}

// --- INTERACTION LAYER: CATEGORY FILTERING ---
function filterProducts(category, btnElement) {
    // Make the clicked button visually 'active'
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    // Filter the list payload dynamically
    if (category === 'All') {
        renderProducts(allProducts);
    } else {
        const filteredList = allProducts.filter(product => product.category === category);
        renderProducts(filteredList);
    }
}

// --- PRESENTATION LAYER: PRODUCT UI DOM GENERATION ---
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Prevent break if layout element isn't found
    
    productList.innerHTML = ''; 

    if (!products || products.length === 0) {
        productList.innerHTML = '<p style="text-align: center; width: 100%;">No products found in this category.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Assembled dynamic structure linking cards securely to product.html detailing
        card.innerHTML = `
            <a href="product.html?id=${product._id}" style="text-decoration: none; color: inherit; display: block;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <span class="category-tag">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
            </a>
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
                </div>
        `;
        productList.appendChild(card);
    });
}

// --- SESSION STORAGE LAYER: PERSISTENT SHOPPING CART ---
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else { 
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElement = document.getElementById('cartCount');
    if (badgeElement) {
        badgeElement.innerText = count;
    }
}

// --- ACTIVE RUNTIME EVENT BOOTSTRAPPER ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchProducts();
});