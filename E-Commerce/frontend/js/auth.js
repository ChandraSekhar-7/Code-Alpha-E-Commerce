// frontend/js/auth.js
// 1. Changed domain to match your live link structure 
// 2. Changed /api/users to /api/auth to match server.js routes exactly!
const API_URL = 'https://code-alpha-e-commerce-1.onrender.com/api/auth';

async function register() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if(!username || !password) return alert("Please fill in all fields");

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registration successful! You can now log in.");
        } else {
            document.getElementById('authMessage').innerText = data.error || "Registration failed.";
        }
    } catch (error) {
        console.error("Registration Error:", error);
        document.getElementById('authMessage').innerText = "Cannot connect to backend.";
    }
}

async function login() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if(!username || !password) return alert("Please fill in all fields");

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('ecommerce_userId', data.userId);
            window.location.href = 'index.html';
        } else {
            document.getElementById('authMessage').innerText = data.error || "Login failed.";
        }
    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById('authMessage').innerText = "Cannot connect to backend.";
    }
}