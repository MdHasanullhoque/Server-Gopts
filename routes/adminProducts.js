
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../models/User");

// Middleware: admin verification
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.headers["x-email"];
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

// GET all products
router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const products = await mongoose.connection.db
      .collection("products")
      .find({})
      .toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// DELETE product
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await mongoose.connection.db
      .collection("products")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH showOnHome
router.patch("/home/:id", verifyAdmin, async (req, res) => {
  try {
    const { showOnHome } = req.body;
    await mongoose.connection.db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { showOnHome } }
    );
    res.json({ message: "Home visibility updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update home visibility" });
  }
});

// PATCH hide product
router.patch("/hide/:id", verifyAdmin, async (req, res) => {
  try {
    const { isHidden } = req.body;
    await mongoose.connection.db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isHidden } }
    );
    res.json({ message: "Product visibility updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product visibility" });
  }
});

module.exports = router;
