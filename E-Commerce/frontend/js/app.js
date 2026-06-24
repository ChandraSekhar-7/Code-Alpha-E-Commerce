if (!localStorage.getItem('ecommerce_userId')) { window.location.href = 'login.html'; }

function logout() {
    localStorage.removeItem('ecommerce_userId');
    localStorage.removeItem('ecommerce_cart');
    window.location.href = 'login.html';
}

let allProducts = []; // Save products here so we can filter them

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        allProducts = await response.json();
        renderProducts(allProducts); // Show all initially
    } catch (error) {
        document.getElementById('product-list').innerHTML = '<h3 style="color:red; text-align:center; width:100%;">Error connecting to server.</h3>';
    }
}

// Function triggered when category buttons are clicked
function filterProducts(category, btnElement) {
    // Make the clicked button visually 'active'
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Filter the list
    if (category === 'All') {
        renderProducts(allProducts);
    } else {
        const filteredList = allProducts.filter(product => product.category === category);
        renderProducts(filteredList);
    }
}

// Draw the products on the screen
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    if (products.length === 0) {
        productList.innerHTML = '<p style="text-align: center; width: 100%;">No products found in this category.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Notice the <a> tags wrapping the image and title!
        card.innerHTML = `
            <a href="product.html?id=${product._id}" style="text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <span class="category-tag">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description" style="margin-bottom:10px;">${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
            </a>
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
                </div>
        `;
        productList.appendChild(card);
    });
}
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });

    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = count;
}

updateCartCount();
fetchProducts();
// ... existing app.js code above ...
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="category-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(card);
    });
// ... existing app.js code below ...