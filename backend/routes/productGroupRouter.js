const express = require("express");
const router = express.Router();
const groupController = require("../controllers/productGroupController");
router.route("/").get(groupController.getAllGroups).post(groupController.createGroup);
router
  .route("/:id")
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);
module.exports = router;
