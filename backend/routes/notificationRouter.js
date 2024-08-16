const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationsController");
const { getNotification, updateNotification, deleteNotification, getNotifications, createNotification } =
  notificationController;

router.route("/").get(getNotifications).post(createNotification);

router.route("/:id").get(getNotification).patch(updateNotification).delete(deleteNotification);

module.exports = router;
