const NotificationModel = require("../models/NotificationModel");
const factory = require("./handlerFactory");
exports.getNotifications = factory.getAll(NotificationModel);

exports.getNotification = factory.getOne(NotificationModel);

exports.deleteNotification = factory.deleteOne(NotificationModel);

exports.updateNotification = factory.updateOne(NotificationModel);

exports.createNotification = factory.createOne(NotificationModel);
