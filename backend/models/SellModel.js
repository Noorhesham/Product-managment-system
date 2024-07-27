const mongoose = require("mongoose");
const Dept = require("./DeptModel");
const AppError = require("../utils/AppError");
const { Schema } = mongoose;
const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  sellPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  customerPaidForAllQuantity: { type: Number, required: true },
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
});
sellSchema.pre("save", async function (next) {
  this.totalSellPrice = this.items.reduce((total, item) => total + item.sellPrice * item.quantity, 0);
  this.customerPaidTotal = this.items.reduce((total, item) => total + item.customerPaidForAllQuantity, 0);
  if (this.totalSellPrice - this.customerPaidTotal === 0) this.isInDept = false;
  else {
    this.isInDept = true;
    const dept = await Dept.findById(this.dept);
    if (dept) {
      dept.deptPrice = this.totalSellPrice - this.customerPaidTotal;
      dept.save();
      next();
    } else {
      const dept = await Dept.create({
        deptPrice: this.totalSellPrice - this.customerPaidTotal,
        customer: this.customer,
      });
      if (!dept) return next(new AppError("Dept not created", 500));
      next();
    }
  }
  next();
});
module.exports = mongoose.model("Sell", sellSchema);
