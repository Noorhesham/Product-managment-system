const factory = require("./handlerFactory");
const Sell = require("../models/SellModel");
const catchError = require("../utils/catchError");
const AppError = require("../utils/AppError");
const Product = require("../models/ProductModel");
const DeptModel = require("../models/DeptModel");

exports.getAllSelling = factory.getAll(Sell);
exports.getSelling = factory.getOne(Sell);
exports.createSelling = factory.createOne(Sell);

exports.updateSelling = catchError(async (req, res, next) => {
  const sell = await Sell.findById(req.params.id);
  if (!sell) return next(new AppError("No sell found with that ID", 404));
  const oldItems = sell.items;
  const newItems = req.body.items;
  for (const item of oldItems) {
    const product = await Product.findById(item.product);
    if (!product) return next(new AppError("Product not found"));
    product.stock = product.stock + item.quantity;
    product.sold =Math.abs( product.sold - item.quantity < 0 ? 0 : product.sold - item.quantity);
    product.soldPrice = Math.abs(Number(product.soldPrice) - Number(item.customerPaidForAllQuantity));
    await product.save();
  }
  for (const item of newItems) {
    const product = await Product.findById(item.product);
    if (!product) return next(new AppError("Product not found"));
    product.stock = product.stock - item.quantity;
    product.sold = product.sold + item.quantity;
    product.soldPrice = Number(product.soldPrice) + Number(item.customerPaidForAllQuantity);
    await product.save();
  }
  const totalSellPrice = newItems.reduce((total, item) => total + item.sellPrice * item.quantity, 0);
  const customerPaidTotal = newItems.reduce((total, item) => total + item.customerPaidForAllQuantity, 0);
  // if (totalSellPrice < customerPaidTotal) {
  // if (!req.user.isAdmin)
  //   return next(
  //     new AppError("ADMIN  only can sell a product with customer paying more than what he supposed to", 400)
  //   );
  // else {
  let overpayment = Math.abs(customerPaidTotal - totalSellPrice);
  let totalOverpayment = customerPaidTotal - sell.customerPaidTotal;
  //100 50
  const depts = await DeptModel.find({ customer: req.body.customer }).sort({ deptDate: 1 });
  for (const dept of depts) {
    console.log(overpayment, dept.deptPrice, customerPaidTotal, totalOverpayment);
    if (overpayment < dept.deptPrice && overpayment !== 0) {
      dept.deptPrice = dept.deptPrice - (totalOverpayment === 0 ? overpayment : totalOverpayment);
      if (dept.deptPrice < 0 || dept.deptPrice === 0) {
        await dept.deleteOne();
      }
      await dept.save();
      break;
    }
    if (overpayment === dept.deptPrice || overpayment === 0) {
      dept.deptPrice = 0;
      overpayment = 0;
      await dept.deleteOne();
      break;
    }
    if (overpayment > dept.deptPrice) {
      dept.deptPrice = 0;

      await dept.deleteOne();
    }
  }
  // }
  // }
  sell.totalSellPrice = totalSellPrice;
  sell.customerPaidTotal = customerPaidTotal;
  sell.items = req.body.items;
  sell.save();
  res.status(200).json({
    status: "success",
    data: {
      sell,
    },
  });
});
exports.getSellingsForProduct = catchError(async (req, res, next) => {
  const { id } = req.params;
  const sellings = await Sell.find({ "items.product": id });
  if (!sellings || sellings.length === 0) return next(new AppError("No sellings found for the given product ID", 404));
  //sell=>items=>{product-sellprice}
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
exports.deleteSelling = catchError(async (req, res, next) => {
  const sell = await Sell.findById(req.params.id);
  // i want to increase the stock that was sold in this sell operation
  // i want t odecrease the sell price of the product
  //i want to decrease the sold quantity of the product
  if (!sell) return next(new AppError("No sell found with that ID", 404));

  const newItems = sell.items;
  newItems?.forEach(async (item) => {
    const product = await Product.findById(item.product);
    console.log(item);
    product.stock = product.stock + item.quantity;
    product.sold = product.sold - item.quantity;
    product.soldPrice = Number(product.soldPrice) - Number(item.customerPaidForAllQuantity);
    await product.save();
  });
  const depts = await DeptModel.find({ customer: req.body.customer }).sort({ deptDate: 1 });
  for (const dept of depts) {
    dept.deptPrice = dept.deptPrice + sell.customerPaidTotal;
    if (dept.deptPrice === 0) {
      dept.deleteOne();
      break;
    } else dept.save();
  }
  await sell.deleteOne();
  res.status(204).json({ status: "deleted successfully" });
});
