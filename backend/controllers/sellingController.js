const factory = require("./handlerFactory");
const Sell = require("../models/SellModel");
const catchError = require("../utils/catchError");
const AppError = require("../utils/AppError");
const Product = require("../models/ProductModel");

exports.getAllSelling = factory.getAll(Sell);
exports.getSelling = factory.getOne(Sell);
exports.createSelling = catchError(async (req, res, next) => {
  for (const item of req.body.items) {
    const product = await Product.findById(item.product);
    if (!product) return next(new AppError("Product not found"));
    if (product.stock < item.quantity) return next(new AppError("Insufficient stock", 400));
    product.stock = product.stock - item.quantity;
    //to do notification
    await product.save();
  }
  const sell = await Sell.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      sell,
    },
  });
});
exports.updateSelling = factory.updateOne(Sell);
exports.deleteSelling = factory.deleteOne(Sell);
exports.getSellingsForProduct = catchError(async (req, res, next) => {
  const { id } = req.params;
  const sellings = await Sell.find({ "items.product": id }).populate("items.product customer");
  if (!sellings || sellings.length === 0) return next(new AppError("No sellings found for the given product ID", 404));

  res.status(200).json({
    status: "success",
    results: sellings.length,
    data: {
      sellings,
    },
  });
});

exports.gettotalSoldMoney = catchError(async (req, res, next) => {
  const totalSoldMoney = await Sell.aggregate([
    {
      $group: {
        _id: null,
        totalSoldMoney: {
          $sum: "$totalPurchasePrice",
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      totalSoldMoney,
    },
  });
});
