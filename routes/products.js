const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get products without schema
router.get('/', async (req, res) => {
    try {
        const products = await mongoose.connection.db
            .collection('products')  // MongoDB collection name
            .find({})
            .limit(6)
            .toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

