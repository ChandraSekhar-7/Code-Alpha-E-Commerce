const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Order processing[cite: 1]
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
    } catch (error) {
        res.status(400).json({ error: "Failed to process order." });
    }
});

module.exports = router;