const { Schema, model } = require("mongoose");
const Product = require("./ProductModel");
const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  purchasePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});
const purchaseSchema = new Schema({
  items: {
    type: [itemSchema],
    required: true,
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "Purchase must have at least one item",
    },
  },
  totalPurchasePrice: { type: Number, required: true, default: 0 },
  purchaseDate: { type: Date, default: Date.now },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
  });
  next();
});

purchaseSchema.pre("save", async function (next) {
  try {
    console.log("Pre-save middleware triggered");
    console.log(this);
    // Compute total purchase price
    this.totalPurchasePrice = this.items.reduce((acc, item) => {
      return acc + (item.purchasePrice || 0) * (item.quantity || 0);
    }, 0);

    console.log("Total Purchase Price computed:", this.totalPurchasePrice);

    // Fetch and update products
    const productUpdates = this.items.map(async (item) => {
      console.log("Processing item:", item);
      const product = await Product.findById(item.product);

      if (!product) {
        console.error("Product not found for item:", item);
        throw new AppError("Product not found");
      }
      console.log("Product found:", item.purchasePrice);
      product.lastPurchasePrice = item.purchasePrice;
      product.stock = (product.stock || 0) + (item.quantity || 0);
      product.purchasePrice = (product.purchasePrice || 0) + (item.purchasePrice || 0) * (item.quantity || 0);
      await product.save();

      console.log("Product updated:", product);
    });

    // Wait for all product updates to finish
    await Promise.all(productUpdates);

    console.log("All products updated successfully");
    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    next(error);
  }
});

module.exports = model("Purchase", purchaseSchema);
