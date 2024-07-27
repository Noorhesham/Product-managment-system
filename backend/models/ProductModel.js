const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "ProductGroup" },
  subGroups: [String],
  stock: { type: Number, default: 0, min: 0 }, // For non-variant products
  price: { type: Number }, // For non-variant products
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
