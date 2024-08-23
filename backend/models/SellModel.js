const mongoose = require("mongoose");
const Dept = require("./DeptModel");
const AppError = require("../utils/AppError");
const Product = require("./ProductModel");
const NotificationModel = require("./NotificationModel");
const { Schema } = mongoose;
const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  sellPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  customerPaidForAllQuantity: {
    type: Number,
    required: true,
  },
});
const sellSchema = new mongoose.Schema({
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
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  totalSellPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  customerPaidTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  sellDate: {
    type: Date,
    default: Date.now,
  },
  isInDept: {
    type: Boolean,
    default: false,
  },
  dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dept",
  },
  serialNumber: {
    type: Number,
    unique: true,
    default: 1,
  },
});
sellSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name",
  }).populate({
    path: "items.product",
  });
  next();
});

sellSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Execute only on create, not update
  const lastSell = await mongoose.model("Sell").findOne().sort({ serialNumber: -1 });
  this.serialNumber = lastSell ? lastSell.serialNumber + 1 : 1;
  
  this.totalSellPrice = this.items.reduce((total, item) => total + item.sellPrice * item.quantity, 0);
  this.customerPaidTotal = this.items.reduce((total, item) => total + item.customerPaidForAllQuantity, 0);

  if (this.totalSellPrice <= this.customerPaidTotal) {
    this.isInDept = false;
  } else {
    this.isInDept = true;
    const dept = await Dept.findById(this.dept);
    if (dept) {
      dept.deptPrice = this.totalSellPrice - this.customerPaidTotal;
      await dept.save();
    } else {
      const newDept = await Dept.create({
        deptPrice: this.totalSellPrice - this.customerPaidTotal,
        customer: this.customer,
      });
      this.dept = newDept._id;
      if (!newDept) return next(new AppError("Dept not created", 500));
    }
  }

  // Check for low stock and underpriced sales
  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.product);
    product.stock = product.stock - item.quantity;
    await product.save();
    // Notification for low stock
    if (product.stock <= 10) {
      await NotificationModel.create({
        type: "Low Stock",
        message: `Product ${product.name} has low stock: ${product.stock} units left.`,
        product: product._id,
      });
    }

    // Notification for selling below purchase price
    if (item.sellPrice < product.purchasePrice) {
      await NotificationModel.create({
        type: "Underpriced Sale",
        message: `Product ${product.name} was sold below purchase price.`,
        product: product._id,
        sell: this._id,
      });
    }
  }

  next();
});
module.exports = mongoose.model("Sell", sellSchema);
