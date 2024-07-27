const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = productController;
router.use(authController.protect);
router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);
router.use("/:productId/purchases", require("./purchasesRouter"));

module.exports = router;
