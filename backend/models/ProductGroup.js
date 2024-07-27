const mongoose = require("mongoose");

const productGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subgroups: [
    {
      type: { name: String, options: [String] }, //[{name:size,options:[lg,sm,md]} ]
    },
  ],
});

module.exports = mongoose.model("ProductGroup", productGroupSchema);
/*
products if group then show the variants 
in upload time  i upload the name and the variants with the options then i take the v
*/
