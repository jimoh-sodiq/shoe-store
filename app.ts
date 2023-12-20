import express from "express";
import dotenv from "dotenv";
import pino from "pino-http";
import "express-async-errors";
import ServerConnector from "./src/db";
import authRouter from "./src/routes/auth.route";
import notFoundMiddleware from "./src/middleware/notfound.middleware";
import errorHandlerMiddleware from "./src/middleware/errorhandler.middleware";

dotenv.config();

const app = express();

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

app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/products", productRouter);
// app.use("/api/v1/reviews", reviewRouter);
// app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const connection = new ServerConnector();
connection.start(app);
