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

  res.status(200).json({
    status: "success",
    data: {
      purchase,
    },
  });
});
exports.deletePurchase = catchError(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return next(new AppError("No purchase found with that ID", 404));
  await Promise.all(
    purchase.items.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, purchasePrice: -(item.purchasePrice * item.quantity) },
      });
    })
  );
  await Purchase.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
exports.updatePurchase = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { items } = req.body;

  // Fetch the old purchase to compute differences
  const oldPurchase = await Purchase.findById(id);
  if (!oldPurchase) return next(new AppError("No purchase found with that ID", 404));

  // Update product stocks and sold prices based on the old purchase 
  await Promise.all(
    oldPurchase.items.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, purchasePrice: -(item.purchasePrice * item.quantity) },
      });
    })
  );
  const totalPurchasePrice = items.reduce((acc, item) => {
    return acc + (item.purchasePrice || 0) * (item.quantity || 0);
  }, 0);
  // Update the purchase
  const updatedPurchase = await Purchase.findByIdAndUpdate(
    id,
    { ...req.body, totalPurchasePrice },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPurchase) return next(new AppError("No purchase found with that ID", 404));

  // Update product stocks and sold prices based on the new purchase
  await Promise.all(
    updatedPurchase.items.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, purchasePrice: item.purchasePrice * item.quantity ,lastPurchasePrice:item.purchasePrice},
      });
    })
  );

  res.status(200).json({ status: "success", data: { updatedPurchase } });
});
exports.getPurchase = factory.getOne(Purchase);
exports.getTotalPurchasedMoney = catchError(async (req, res, next) => {
  const totalPurchasedMoney = await Purchase.aggregate([
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
});
