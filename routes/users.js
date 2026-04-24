
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ================= Middleware: Admin verification =================
const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.headers["x-email"]; // frontend থেকে admin email
        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "User not found" });
        if (user.role !== "admin")
            return res.status(403).json({ message: "Admin only access" });

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET all users =================
// Add verifyAdmin if only admin can see users
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find(
            {},
            "uid name email role status suspendReason suspendFeedback photoURL"
        );
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= GET user by UID / email =================
router.get("/uid/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const { email } = req.query;

        let user = await User.findOne({ uid });
        if (!user && email) user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Update suspend / role =================
router.patch("/:id", verifyAdmin, async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= Sync user (Login/Register) =================
router.post("/sync", async (req, res) => {
    try {
        const { uid, name, email, photoURL, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                uid,
                name,
                email,
                photoURL,
                role: role || "buyer",
                status: "approved"  // "active" → "approved"
            });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
