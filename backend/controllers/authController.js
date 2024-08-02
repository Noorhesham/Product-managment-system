const RefreshTokenModel = require("../models/RefreshTokenModel");
const User = require("../models/UserModel");
const AppError = require("../utils/AppError");
const catchError = require("../utils/catchError");
const jwt = require("jsonwebtoken");
const JWT_EXPIRES = "15min";
const REFRESH_TOKEN_EXPIRES = "7d";
const generateToken = (id) => {
  //generate a jwt that takes the id of user as payload , secret ,expirey date
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

const cookieOptions = {
  expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax", // Consider using 'lax' for development
  secure: false,
};
const sendResponse = async (res, user, code) => {
  const token = generateToken(user._id);
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: REFRESH_TOKEN_EXPIRES });
  if (process.env.NODE_ENV === "production ") cookieOptions.secure = true;
  const uppdated = await User.findByIdAndUpdate(user._id, { refreshToken });
  console.log(uppdated, "uppdated");
  res.cookie("jwt", refreshToken, user);
  user.password = undefined;
  res.status(code).json({ status: "success", token, data: { user } });
};
exports.login = catchError(async (req, res, next) => {
  //auth user
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Please provide email and password", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) return next(new AppError("Incorrect email or password", 401));
  sendResponse(res, user, 200);
});
exports.register = catchError(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({ email: req.body.email, password: req.body.password, name: req.body.name });
  console.log(newUser);
  if (!newUser) return next(new AppError("Something went wrong", 400));
  sendResponse(res, newUser, 201);
});
exports.protect = catchError(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("You are not logged in. Please log in to get access", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  //decode token (take the payload header and the secrent make the signature and compare it with the signature already in it )
  //the payload after decoded will include id and iat
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("The user belonging to this token does no longer exist", 401));
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError("User recently changed password. Please log in again", 401));
  req.user = currentUser;
  next();
});

exports.refresh = catchError(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return next(new AppError("You are not logged in. Please log in to get access", 401));
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) return next(new AppError("Refresh token is not valid", 403));
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) return next(new AppError("Refresh token is not valid", 403));
    const token = generateToken(existingUser?._id);
    return res.status(200).json({ status: "success", token, data: { user: existingUser } });
  });
});

exports.logout = catchError(async (req, res, next) => {
  if (!req.cookies.jwt) return res.status(204).json({ status: "success" });
  const refreshToken = req.cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("jwt", cookieOptions);
    return res.status(204).json({ status: "success" });
  }
  user.refreshToken = "";
  await user.save();
  res.clearCookie("jwt", cookieOptions);
  res.status(200).json({ status: "success" });
});
