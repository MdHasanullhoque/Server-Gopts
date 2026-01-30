

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// // GET all users
// router.get("/", async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;


//30-01-2026


const express = require('express');
const router = express.Router();
const User = require('../models/User'); // mongoose user model

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, "name email role"); // just these fields
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// PATCH /users/:id → update user role
router.patch('/:id', async (req, res) => {
    try {
        const { role, status } = req.body; // role = "manager" or "buyer", status = active/suspended
        const user = await User.findByIdAndUpdate(req.params.id, { role, status }, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
