import mongoose from "mongoose";
import { TSingleOrderItem, TOrder } from "../types/order.type";

const SingleOrderItemSchema = new mongoose.Schema<TSingleOrderItem>({
  name: { type: String, required: true },
  images: { type: [String], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
});

const OrderSchema = new mongoose.Schema<TOrder>(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "shipped", "delivered", "failed", "cancelled"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

const SingleOrderItem = mongoose.model(
  "SingleOrderItem",
  SingleOrderItemSchema
);

const Order = mongoose.model("Order", OrderSchema);

export { SingleOrderItem, Order };
