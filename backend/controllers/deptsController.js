const factory = require("./handlerFactory");
const Dept = require("../models/DeptModel");
exports.getAllDepts = factory.getAll(Dept);
exports.getDept = factory.getOne(Dept);
exports.createDept = factory.createOne(Dept);
exports.updateDept = factory.updateOne(Dept);
exports.deleteDept = factory.deleteOne(Dept);
