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
  totalPurchasePrice: { type: Number, required: true , default: 0},
  purchaseDate: { type: Date, default: Date.now },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
  });
  next();
});

purchaseSchema.pre("save", function (next) {
  this.totalPurchasePrice = this.items.reduce((acc, item) => {
    return acc + (item.purchasePrice * item.quantity);
  }, 0);

  next();
});
module.exports = model("Purchase", purchaseSchema);
