const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  shortDescription: String,
  price: Number,
  imageUrl: String,
  availableQuantity: Number,
});

module.exports = mongoose.model("Product", productSchema);
