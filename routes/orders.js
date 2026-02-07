
// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const User = require("../models/User");

// // Order Schema
// const orderSchema = new mongoose.Schema({
//     productId: String,
//     productTitle: String,
//     price: Number,
//     quantity: Number,
//     orderPrice: Number,
//     email: String,
//     firstName: String,
//     lastName: String,
//     contactNumber: String,
//     address: String,
//     notes: String,
//     paymentMethod: String,
//     status: { type: String, default: "Pending" },
//     createdAt: { type: Date, default: Date.now }
// });

// const Order = mongoose.model("Order", orderSchema);

// /* ===== BUYER: CREATE ORDER ===== */
// router.post("/", async (req, res) => {
//     try {
//         const order = req.body;
//         if (!order.productId || !order.email)
//             return res.status(400).json({ message: "Product ID and email required" });

//         const user = await User.findOne({ email: order.email });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (user.status === "suspended")
//             return res.status(403).json({
//                 message: "You are suspended",
//                 reason: user.suspendReason,
//                 feedback: user.suspendFeedback
//             });

//         const newOrder = new Order({
//             ...order,
//             status: "Pending" // capital P → match My Orders
//         });
//         await newOrder.save();

//         res.status(201).json({ message: "Order created", id: newOrder._id });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /* ===== BUYER: GET MY ORDERS ===== */
// router.get("/my-orders", async (req, res) => {
//     try {
//         const email = req.query.email;
//         if (!email) return res.status(400).json({ message: "Email required" });

//         const orders = await Order.find({ email }).sort({ createdAt: -1 });
//         res.json(orders);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /* ===== ADMIN: GET ALL ORDERS ===== */
// router.get("/", async (req, res) => {
//     try {
//         const email = req.headers["x-email"];
//         if (!email) return res.status(401).json({ message: "Unauthorized" });

//         const user = await User.findOne({ email });
//         if (!user || user.role !== "admin")
//             return res.status(403).json({ message: "Admin only access" });

//         const orders = await Order.find({}).sort({ createdAt: -1 });
//         res.json(orders);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// Order Schema
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

const Order = mongoose.model("Order", orderSchema);

/* ===== CREATE ORDER (Buyer) ===== */
router.post("/", async (req, res) => {
    try {
        const order = req.body;
        if (!order.productId || !order.email)
            return res.status(400).json({ message: "Product ID and email required" });

        const user = await User.findOne({ email: order.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.status === "suspended")
            return res.status(403).json({
                message: "You are suspended",
                reason: user.suspendReason,
                feedback: user.suspendFeedback
            });

        const newOrder = new Order({
            ...order,
            status: "Pending"
        });
        await newOrder.save();

        res.status(201).json({ message: "Order created", id: newOrder._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ===== MY ORDERS (Buyer) ===== */
router.get("/my-orders", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: "Email required" });

        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ===== ALL ORDERS (Admin) ===== */
router.get("/", async (req, res) => {
    try {
        const email = req.headers["x-email"];
        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ email });
        if (!user || user.role !== "admin")
            return res.status(403).json({ message: "Admin only access" });

        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});



// PATCH /orders/:id/status → update order status (admin only)
router.patch("/:id/status", async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body; // "Pending", "Approved", "Rejected"
        const email = req.headers["x-email"]; // admin email

        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const adminUser = await User.findOne({ email });
        if (!adminUser || adminUser.role !== "admin")
            return res.status(403).json({ message: "Admin only" });

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder)
            return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order updated", order: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
