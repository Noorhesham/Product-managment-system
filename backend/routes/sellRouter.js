const express = require("express");
const router = express.Router();
const sellController = require("../controllers/sellingController");
router.route("/").get(sellController.getAllSelling).post(sellController.createSelling);
router
  .route("/:id")
  .get(sellController.getSelling)
  .patch(sellController.updateSelling)
  .delete(sellController.deleteSelling);
  router.route("/product/:id").get(sellController.getSellingsForProduct);
module.exports = router;
