const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchaseController");

//get all the data about the puchases
router.route("/").get(purchasesController.getPurchases).post(purchasesController.createPurchase);
router.get("/total", purchasesController.getTotalPurchasedMoney);
router
  .route("/:id")
  .get(purchasesController.getPurchase)
  .patch(purchasesController.updatePurchase)
  .delete(purchasesController.deletePurchase);
module.exports = router;
