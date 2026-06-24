// Protect the cart page too
const userId = localStorage.getItem('ecommerce_userId');
if (!userId) window.location.href = 'login.html';

let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const checkoutSection = document.getElementById('checkoutSection');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        checkoutSection.style.display = 'none';
        document.getElementById('cartTotal').innerText = 'Total: $0.00';
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; margin-bottom: 10px; border-radius: 5px;">
            <span><b>${item.name}</b> (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').innerText = `Total: $${total.toFixed(2)}`;
    
    // Show the checkout form if there are items
    checkoutSection.style.display = 'block';
}

async function placeOrder(event) {
    event.preventDefault(); // Stop page reload

    const address = document.getElementById('address').value;
    const paymentMode = document.getElementById('paymentMode').value;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        userId: userId,
        items: cart,
        totalAmount: totalAmount,
        address: address,
        paymentMode: paymentMode
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("Order placed successfully! Thank you for shopping.");
            localStorage.removeItem('ecommerce_cart'); // Clear cart
            window.location.href = 'index.html'; // Send back to store
        } else {
            alert("Failed to place order.");
        }
    } catch (error) {
        console.error(error);
        alert("Server error while placing order.");
    }
}

renderCart();