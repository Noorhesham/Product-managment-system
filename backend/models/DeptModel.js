const mongoose = require("mongoose");

const DeptSchema = new mongoose.Schema({
  deptPrice: {
    type: Number,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  deptDate: {
    type: Date,
    default: Date.now,
  },
});

DeptSchema.pre(/^find/, function (next) {
  this.populate("customer");
  next();
});

module.exports = mongoose.model("Dept", DeptSchema);
