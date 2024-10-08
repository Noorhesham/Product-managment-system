const Product = require("../models/ProductModel");
const catchError = require("../utils/catchError");
const factory = require("./handlerFactory");
const Sell = require("../models/SellModel");
const Purchase = require("../models/PurchaseModel");
const SellModel = require("../models/SellModel");
const PurchaseModel = require("../models/PurchaseModel");
const DeptModel = require("../models/DeptModel");
const CustomerModel = require("../models/CustomerModel");
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.getProductDetails = catchError(async (req, res, next) => {
  const { page = 1, limit = 10, id } = req.query;
  console.log(id);
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  const sellsForProduct = await Sell.find({ "items.product": req.params.id })
    .skip((page - 1) * limit)
    .limit(limit);
  console.log(sellsForProduct);
  const totalSells = await Sell.countDocuments({ "items.product": req.params.id });

  const purchasesForProduct = await Purchase.find({ "items.product": req.params.id })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalPurchases = await Purchase.countDocuments({ "items.product": req.params.id });

  res.status(200).json({
    status: "success",
    data: {
      product,
      pagination: {
        totalSells,
        totalPurchases,
        totalPagesSells: Math.ceil(totalSells / limit),
        totalPagesPurchases: Math.ceil(totalPurchases / limit),
      },
      sellsForProduct,
      purchasesForProduct,
    },
  });
});
exports.getCounts = catchError(async (req, res, next) => {
  const totalProducts = await Product.countDocuments();
  const totalSells = await SellModel.countDocuments();
  const totalPurchases = await PurchaseModel.countDocuments();
  const totalDebts = await DeptModel.countDocuments();
  const totalCustomers=await CustomerModel.countDocuments()
  console.log(totalProducts, totalSells, totalPurchases, totalDebts);
  res.status(200).json({
    status: "success",
    data: {
      totalProducts,
      totalSells,
      totalPurchases,
      totalDebts,totalCustomers
    },
  });
});
