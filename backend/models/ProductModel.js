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
  sold: { type: Number, default: 0, min: 0 },
  soldPrice: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  lastPurchasePrice :{ type: Number, default: 0 }
});
productSchema.index({ name: 1, group: 1, subGroups: 1 }, { unique: true });
productSchema.pre(/^find/, function (next) {
  this.populate('group');
  next();
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
