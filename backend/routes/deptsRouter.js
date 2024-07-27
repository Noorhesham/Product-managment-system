const express = require("express");
const router = express.Router();
const deptsController = require("../controllers/deptsController");
router.route("/").get(deptsController.getAllDepts).post(deptsController.createDept);
router
  .route("/:id")
  .get(deptsController.getDept)
  .patch(deptsController.updateDept)
  .delete(deptsController.deleteDept);
module.exports = router;
