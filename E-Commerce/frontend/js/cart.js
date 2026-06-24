// frontend/js/cart.js
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    let userId = localStorage.getItem('ecommerce_userId') || "guest123";

    function renderCart() {
        const cartDiv = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const checkoutSec = document.getElementById('checkout-section');
        
        if (!cartDiv) return;
        cartDiv.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartDiv.innerHTML = '<p style="text-align:center; padding: 20px; color:#7f8c8d;">Your cart is empty.</p>';
            if(checkoutSec) checkoutSec.style.display = 'none';
            if(totalEl) totalEl.innerText = 'Total: $0.00';
            return;
        }

        if(checkoutSec) checkoutSec.style.display = 'block';
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartDiv.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong> <span style="color:#7f8c8d;">(x${item.quantity})</span>
                    </div>
                    <div>
                        <span style="margin-right:20px; font-weight:bold;">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button onclick="removeItem(${index})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Remove</button>
                    </div>
                </div>
            `;
        });
        
        if(totalEl) totalEl.innerText = `Total: $${total.toFixed(2)}`;
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
        renderCart();
    };

    window.placeOrder = async function() {
        const address = document.getElementById('address').value;
        const paymentMode = document.getElementById('payment-mode').value;
        
        if(!address.trim()) {
            alert("Please provide a shipping address to process delivery.");
            return;
        }

        let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderData = {
            userId: userId,
            items: cart,
            totalAmount: totalAmount,
            address: address,
            paymentMode: paymentMode
        };

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if(response.ok) {
                alert('Success! Your order has been placed.');
                localStorage.removeItem('ecommerce_cart'); // Clear cart data
                window.location.href = 'orders.html'; // Direct to User Order History
            } else {
                alert('Could not submit purchase request.');
            }
        } catch (error) {
            alert('Error mapping network request to server.');
        }
    };

    renderCart();
});