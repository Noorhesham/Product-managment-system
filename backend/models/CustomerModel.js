const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: Number },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

customerSchema.virtual("depts", {
  ref: "Dept",
  localField: "_id",
  foreignField: "customer",
});

// Removed automatic population to avoid infinite loops
module.exports = mongoose.model("Customer", customerSchema);
