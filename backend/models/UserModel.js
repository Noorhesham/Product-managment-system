const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, select: false, required: true },
  createdAt: { type: Date, default: Date.now },
  passwordChangeAt: Date,
  isAdmin: { type: Boolean, default: false },
  refreshToken: { type: String },
});

UserSchema.pre("save",async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
module.exports = mongoose.model("User", UserSchema);
