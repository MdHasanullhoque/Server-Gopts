const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await mongoose.connection.db
            .collection('products')
            .findOne({ _id: new ObjectId(id) });

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
