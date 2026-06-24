require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
// --- SECURITY: ONLY ALLOW YOUR LIVE FRONTEND ---
app.use(cors({
    origin: 'https://code-alpha-e-commerce.onrender.com', // Your Render live link
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- DATABASE CONNECTION ---
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const MONGO_URI = `mongodb+srv://${dbUser}:${dbPass}@project.kjzooku.mongodb.net/codealpha_store?appName=Project`;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// --- MODELS (Updated with Images and Categories) ---
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, price: Number, description: String,
    image: String,     // NEW
    category: String   // NEW
}));
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));
const Order = mongoose.model('Order', new mongoose.Schema({
    userId: String, items: Array, totalAmount: Number, address: String, paymentMode: String, status: { type: String, default: 'Pending' }
}));

// --- ROUTES ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) { res.status(500).json({ error: "Failed to fetch products" }); }
});
app.post('/api/users/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (err) { res.status(400).json({ error: "Username might exist." }); }
});
app.post('/api/users/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) res.json({ message: "Login successful", userId: user._id });
    else res.status(401).json({ error: "Invalid credentials" });
});
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) { res.status(400).json({ error: "Failed to process order" }); }
});

app.listen(process.env.PORT || 3000, () => console.log(`✅ Server running`));