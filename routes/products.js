// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// // Get products without schema
// router.get('/', async (req, res) => {
//     try {
//         const products = await mongoose.connection.db
//             .collection('products')  // MongoDB collection name
//             .find({})
//             .limit(6)
//             .toArray();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;




//new 


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

module.exports = router;
