const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MongoDB Order Schema
const orderSchema = new mongoose.Schema({
    productId: String,
    productTitle: String,
    price: Number,
    quantity: Number,
    orderPrice: Number,
    email: String,
    firstName: String,
    lastName: String,
    contactNumber: String,
    address: String,
    notes: String,
    paymentMethod: String,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// POST /orders → create new order
router.post('/', async (req, res) => {
    try {
        const order = req.body;

        if (!order.productId || !order.email) {
            return res.status(400).json({ message: "Product ID and email are required" });
        }

        const newOrder = new Order(order);
        await newOrder.save();

        res.status(201).json({ message: "Order created", id: newOrder._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /orders → get all orders (optional)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
