require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// --- SECURITY: ALLOW LOCALHOST FRONTEND REQUESTS ---
app.use(cors({
    origin: 'https://code-alpha-e-commerce-1.onrender.com'
})); 

// --- DATABASE CONNECTION ---
const MONGO_URI = `mongodb+srv://chandrasekhartatimalla_db_user1:chandhu@project.kjzooku.mongodb.net/codealpha_store?appName=Project`;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// --- DATA SCHEMAS & MODELS ---
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, 
    price: Number, 
    description: String,
    image: String,     
    category: String   
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: String, 
    items: Array, 
    totalAmount: Number, 
    address: String, 
    paymentMode: String, 
    status: { type: String, default: 'Pending' }
}));

// --- ROUTES ---

// ==========================================
// 1. AUTHENTICATION ROUTES (Matches frontend auth.js endpoints)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Using username as fallback if email is passed to keep it compatible with model
        const newUser = new User({ username: username || email, password });
        await newUser.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (err) { 
        res.status(400).json({ error: "Username or email might already exist." }); 
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const targetUsername = username || email; // Resolving form properties dynamically

        const user = await User.findOne({ username: targetUsername, password: password });
        if (user) {
            res.json({ message: "Login successful", userId: user._id });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server authentication error" });
    }
});

// ==========================================
// 2. PRODUCT LAYERS (Powers index.html grid & product.html details)
// ==========================================
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) { 
        res.status(500).json({ error: "Failed to fetch products" }); 
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found inside database" });
        }
        res.json(product);
    } catch (err) { 
        res.status(500).json({ error: "Invalid Product ID format string parsed" }); 
    }
});

// ==========================================
// 3. ORDER PROCESSING ROUTES (Powers Cart Checkout & Orders Timeline)
// ==========================================
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order processed and saved successfully!" });
    } catch (err) { 
        res.status(500).json({ error: "Failed to compile and save order documentation" }); 
    }
});

app.get('/api/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ _id: -1 });
        res.json(orders);
    } catch (err) { 
        res.status(500).json({ error: "Failed to map order configuration history" }); 
    }
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));