const mongoose = require("mongoose");

const productGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subgroups: [
    {
      name: String,
      options: [String], // Options for subgroups like ["S", "M", "L"]
    },
  ],
});

const ProductGroup = mongoose.model("ProductGroup", productGroupSchema);
module.exports = ProductGroup;
