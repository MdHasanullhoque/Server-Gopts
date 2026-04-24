const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// GET all products (Home page - showOnHome only)
router.get('/', async (req, res) => {
    try {
        const db = mongoose.connection.readyState === 1 ? mongoose.connection.db : null;
        if (!db) return res.status(500).json({ error: "Database not connected" });

        const products = await db
            .collection('products')
            .find({ showOnHome: true, isHidden: { $ne: true } })
            .limit(6)
            .toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all products (All Products page - no showOnHome filter)
router.get('/all', async (req, res) => {
    try {
        const db = mongoose.connection.readyState === 1 ? mongoose.connection.db : null;
        if (!db) return res.status(500).json({ error: "Database not connected" });

        const products = await db
            .collection('products')
            .find({ isHidden: { $ne: true } })
            .toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await mongoose.connection.db
            .collection('products')
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD PRODUCT (Manager)
router.post('/add', async (req, res) => {
    try {
        const { title, description, category, price, availableQuantity, moq, images, demoVideo, paymentOption, showOnHome, email } = req.body;

        if (!title || !price || !category || !availableQuantity)
            return res.status(400).json({ message: "Required fields missing" });

        const user = await mongoose.connection.db.collection('users').findOne({ email });
        if (!user || user.role !== "manager")
            return res.status(403).json({ message: "Manager only access" });

        const product = {
            title, description, category,
            price: Number(price),
            availableQuantity: Number(availableQuantity),
            moq: Number(moq),
            images: images || [],
            demoVideo: demoVideo || "",
            paymentOption,
            showOnHome: showOnHome || false,
            isHidden: false,
            createdBy: email,
            createdAt: new Date()
        };

        await mongoose.connection.db.collection('products').insertOne(product);
        res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const result = await mongoose.connection.db
            .collection('products')
            .deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE product
router.patch('/:id', async (req, res) => {
    try {
        await mongoose.connection.db
            .collection('products')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        res.json({ message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;