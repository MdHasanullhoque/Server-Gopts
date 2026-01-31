


const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ================= GET all users =================
router.get('/', async (req, res) => {
    try {
        const users = await User.find(
            {},
            "uid name email role status suspendReason suspendFeedback"
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= GET user by UID (email fallback) =================
router.get('/uid/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { email } = req.query;

        let user = await User.findOne({ uid });

        if (!user && email) {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Update suspend / role =================
router.patch('/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
