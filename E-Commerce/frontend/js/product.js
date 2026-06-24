// frontend/js/product.js
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Helper utility to output unique tech metrics depending on category
    function getExtraSpecs(category, name) {
        if (category === "Electronics") {
            return `
                <tr><td class="label">Warranty</td><td class="value">1 Year Limited Manufacturer Warranty</td></tr>
                <tr><td class="label">Connectivity</td><td class="value">High-Speed Cloud Sync Compliant</td></tr>
                <tr><td class="label">Power Source</td><td class="value">Lithium-ion Rechargeable Built-in</td></tr>
            `;
        } else if (category === "Clothing") {
            return `
                <tr><td class="label">Material Fabric</td><td class="value">Premium Breathable Active Weave</td></tr>
                <tr><td class="label">Fit / Size</td><td class="value">Standard Global Dynamic Fit</td></tr>
                <tr><td class="label">Care Guide</td><td class="value">Machine Wash Cold, Tumble Dry Low</td></tr>
            `;
        } else if (category === "Sports") {
            return `
                <tr><td class="label">Material Type</td><td class="value">Professional Grade English Willow / Composite</td></tr>
                <tr><td class="label">User Grade</td><td class="value">Tournament & Defensive Field Approved</td></tr>
            `;
        } else {
            return `
                <tr><td class="label">Build Quality</td><td class="value">Ergonomic Premium Structural Plastic</td></tr>
                <tr><td class="label">Compatibility</td><td class="value">Universal Plug-and-Play Cross-Platform</td></tr>
            `;
        }
    }

    async function loadProduct() {
        if (!productId) {
            document.getElementById('single-product-view').innerHTML = `<h2 style="text-align:center; color:red;">No product selected.</h2>`;
            return;
        }

        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const product = await response.json();

            if (response.ok) {
                const specRows = getExtraSpecs(product.category, product.name);

                document.getElementById('single-product-view').innerHTML = `
                    <div class="product-details-container">
                        <img src="${product.image}" alt="${product.name}" class="details-image">
                        <div class="details-info">
                            <div class="badge-status instock">✓ Verified Item In Stock</div>
                            <span class="category-tag" style="background:#34495e; color:white; padding:4px 10px; border-radius:4px; width:fit-content; font-size:0.75rem; text-transform:uppercase; font-weight:bold; letter-spacing:1px;">${product.category}</span>
                            <h1>${product.name}</h1>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            
                            <div class="description-box">
                                <strong>Product Overview:</strong><br>
                                ${product.description}
                            </div>

                            <h3 style="color:#2c3e50; border-bottom:2px solid #34495e; padding-bottom:5px; font-size:1.1rem; margin-bottom:5px;">Technical Details</h3>
                            <table class="specs-table">
                                <tbody>
                                    <tr><td class="label">Item Identifier</td><td class="value">${product._id}</td></tr>
                                    <tr><td class="label">Shipping Class</td><td class="value">Dispatched within 24-48 Hours</td></tr>
                                    ${specRows}
                                </tbody>
                            </table>

                            <button class="btn-large" onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add Selected Item To Cart</button>
                        </div>
                    </div>
                `;
            } else {
                document.getElementById('single-product-view').innerHTML = `<h2 style="text-align:center; color:red;">Product data structure could not be retrieved.</h2>`;
            }
        } catch (error) {
            document.getElementById('single-product-view').innerHTML = `<h2 style="text-align:center; color:red;">Network link timeout querying backend API.</h2>`;
        }
    }

    loadProduct();
});

window.addToCart = function(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });

    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    alert(`${name} added to cart successfully!`);
};