const express = require("express");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const cors = require("cors");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const productsRouter = require("./routes/productsRouter");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const app = express();
app.use(helmet());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(cors({ credentials: true, origin: true }));
app.use("/api/products", productsRouter);
app.use("/api/purchases", require("./routes/purchasesRouter"));
app.use("/api/sells", require("./routes/sellRouter"));
app.use("/api/groups", require("./routes/productGroupRouter"));
app.use("/api/customers", require("./routes/customerRouter"));
app.use("/api/depts", require("./routes/deptsRouter"));
app.use("/api/auth", require("./routes/authRouter"));
app.all("*", (err, req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
/*
upload product crud 
variants crud
*/
