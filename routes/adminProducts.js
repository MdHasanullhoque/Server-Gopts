const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

// GET all products (Admin)
router.get("/all", async (req, res) => {
  try {
    const products = await mongoose.connection.db
      .collection("products")
      .find({})
      .toArray();
    res.json(products); // always array
  } catch (err) {
    console.error(err);
    res.status(500).json([]); // return empty array on error
  }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
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

// Toggle show on home
router.patch("/home/:id", async (req, res) => {
  try {
    const { showOnHome } = req.body;
    await mongoose.connection.db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { showOnHome } }
    );
    res.json({ message: "Updated showOnHome" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
