import express from "express";
import pino from "pino-http";
import "express-async-errors";
import ServerConnector from "./src/core/db";
import notFoundMiddleware from "./src/middleware/notfound.middleware";
import errorHandlerMiddleware from "./src/middleware/errorhandler.middleware";
import cookieParser from "cookie-parser";
import globalConfig from "./src/core/config";
import authRouter from "./src/routes/auth.route";
import userRouter from "./src/routes/user.route";
import orderRouter from "./src/routes/order.route";
import reviewRouter from "./src/routes/review.route";
import productRouter from "./src/routes/product.route";
import { v2 as cloudinary } from "cloudinary";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cors from "cors";

const app = express();
cloudinary.config({
  cloud_name: globalConfig.cloudinary.cloudName,
  api_key: globalConfig.cloudinary.apiKey,
  api_secret: globalConfig.cloudinary.apiSecret,
});
// logger
app.use(
  pino({
    quietReqLogger: true,
    transport: {
      target: "pino-http-print", // use the pino-http-print transport and its formatting output
      options: {
        destination: 1,
        all: true,
        translateTime: true,
      },
    },
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use(express.static("./src/public"));
app.use(express.json());
app.use(cookieParser(globalConfig.auth.jwtSecret));
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials
  })
);

// health check
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const connection = new ServerConnector();
connection.start(app);
