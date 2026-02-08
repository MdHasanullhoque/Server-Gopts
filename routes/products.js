

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await mongoose.connection.db
            .collection('products')
            .find({})
            .limit(6)
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

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ADD PRODUCT (Manager)
router.post('/add', async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            price,
            availableQuantity,
            moq,
            images,
            demoVideo,
            paymentOption,
            showOnHome,
            email
        } = req.body;

        // basic validation
        if (!title || !price || !category || !availableQuantity || !moq) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // check manager
        const user = await mongoose.connection.db
            .collection('users')
            .findOne({ email });

        if (!user || user.role !== "manager") {
            return res.status(403).json({ message: "Manager only access" });
        }

        const product = {
            title,
            description,
            category,
            price: Number(price),
            availableQuantity: Number(availableQuantity),
            moq: Number(moq),
            images: images || [],
            demoVideo: demoVideo || "",
            paymentOption,
            showOnHome: showOnHome || false,
            createdBy: email,
            createdAt: new Date()
        };

        await mongoose.connection.db
            .collection('products')
            .insertOne(product);

        res.status(201).json({ message: "Product added successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
