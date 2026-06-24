async function loadProductDetails() {
    // Get the product ID from the URL (e.g., product.html?id=64abc123...)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-details').innerHTML = '<h2>Product not found</h2>';
        return;
    }

    try {
        const response = await fetch(`https://code-alpha-e-commerce-backend-1.onrender.com/api/products/${productId}`);
        const product = await response.json();

        if (response.ok) {
            document.getElementById('product-details').innerHTML = `
                <h2>${product.name}</h2>
                <p style="font-size: 1.5rem; color: #27ae60; margin: 1rem 0;">$${product.price.toFixed(2)}</p>
                <p style="margin-bottom: 2rem; color: #555;">${product.description || "No description available for this product."}</p>
                <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})" 
                        style="padding: 10px 20px; background-color: #3498db; color: white; border: none; cursor: pointer;">
                    Add to Cart
                </button>
            `;
        } else {
            document.getElementById('product-details').innerHTML = '<h2>Product not found</h2>';
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
        document.getElementById('product-details').innerHTML = '<p>Error loading product details.</p>';
    }
}

// Local addToCart function for the product page
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    
    // Update the cart count in the header
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    alert(`${name} added to cart!`);
}

loadProductDetails();