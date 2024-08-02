const factory = require("../controllers/handlerFactory");
const Purchase = require("../models/PurchaseModel");
const Product = require("../models/ProductModel");
const catchError = require("../utils/catchError");
const AppError = require("../utils/AppError");

exports.getPurchases = catchError(async (req, res, next) => {
  const productId = req.params.productId;
  const purchases = productId ? await Purchase.find({ product: req.params.productId }) : await Purchase.find({});
  res.status(200).json({
    status: "success",
    results: purchases.length,
    data: {
      purchases,
    },
  });
});
//product subcategoreis [size:small,flavour:vege,stock:10]
exports.createPurchase = catchError(async (req, res, next) => {
  const { items } = req.body;
  const purchase = await Purchase.create(req.body);
  if (!purchase) return next(new AppError("Failed to create purchase"));
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return next(new AppError("Product not found"));
    console.log(product);
    product.stock = product.stock + item.quantity;
    product.purchasePrice = product.purchasePrice + item.purchasePrice;
    await product.save();
  }
  res.status(200).json({
    status: "success",
    data: {
      purchase,
    },
  });
});
exports.deletePurchase = factory.deleteOne(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.getPurchase = factory.getOne(Purchase);
exports.getTotalPurchasedMoney=catchError(async(req,res,next)=>{
  const totalPurchasedMoney=await Purchase.aggregate([
    {
      $group: {
        _id: null,
        totalPurchasedMoney: {
          $sum: "$totalPurchasePrice",
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      totalPurchasedMoney,
    },
  });
})