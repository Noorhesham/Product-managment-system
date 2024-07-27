const factory = require("./handlerFactory");
const customer = require("../models/CustomerModel");

exports.getAllCustomers = factory.getAll(customer);
exports.getCustomer = factory.getOne(customer);
exports.createCustomer = factory.createOne(customer);
exports.updateCustomer = factory.updateOne(customer);
exports.deleteCustomer = factory.deleteOne(customer);
