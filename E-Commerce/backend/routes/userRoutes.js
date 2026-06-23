const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User[cite: 1]
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration failed." });
    }
});

// Login User[cite: 1]
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ message: "Login successful", userId: user._id });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

module.exports = router;