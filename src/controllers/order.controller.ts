import Product from "../models/product.model";
import { Order } from "../models/order.model";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import fs from "fs";
import {
  createResponse,
  attachCookiesToResponse,
} from "../utils/response.util";
import * as CustomError from "../errors";
import { RequestWithUser } from "../types/request.type";
import { TSingleOrderItem, TOrder } from "../types/order.type";
import { confirmOwnership } from "../utils/user.util";

const fakeStripeApi = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const clientSecret = "arandomclientsecret";
  return { clientSecret, amount };
};

export async function createOrder(req: Request, res: Response) {
  const { orderItems, tax, shippingFee } = req.body;
  if (!orderItems || orderItems.length < 1) {
    throw new CustomError.BadRequestError("No order items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let subTotal = 0;

  const revampOrderItems = await Promise.all(
    orderItems.map(async (item: TSingleOrderItem) => {
      const dbProduct = await Product.findOne({ _id: item.product });
      if (!dbProduct) {
        throw new CustomError.NotFoundError(
          `No product with id ${item.product}`
        );
      }
      const { name, price, images, _id: productId } = dbProduct;
      const singleOrderItem = {
        quantity: item.quantity,
        name,
        price,
        images,
        product: productId,
      };
      return singleOrderItem;
    })
  );

  subTotal = revampOrderItems.reduce((acc, curr) => {
    return (acc += curr.price * curr.quantity);
    console.log(subTotal);
  }, 0);
  const total = subTotal + tax + shippingFee;

  //   GET CLIENT SECRET
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "NGN",
  });
  const order = await Order.create({
    tax,
    shippingFee,
    subTotal,
    total,
    orderItems: revampOrderItems,
    user: (req as RequestWithUser).user.userId,
    clientSecret: paymentIntent.clientSecret,
  });

  res
    .status(StatusCodes.CREATED)
    .json(createResponse(true, { order, clientSecret: order.clientSecret }));
}

export async function getAllOrders(req: Request, res: Response) {
  const orders = await Order.find({});
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { orders, count: orders.length },
        "orders retrieved successfully"
      )
    );
}

export async function getCurrentUserOrder(req: Request, res: Response) {
  const userId = (req as RequestWithUser).user.userId;
  const orders = await Order.find({ user: userId });
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { orders, count: orders.length },
        "orders retrieved successfully"
      )
    );
}

export async function getSingleOrder(req: Request, res: Response) {
  const orderId = req.params.id;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError("order not found");
  }
  confirmOwnership((req as RequestWithUser).user, order.user);
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { order }, "order retrieved successfully"));
}

export async function updateOrder(req: Request, res: Response) {
  const { paymentIntentId } = req.body;
  const orderId = req.params.id;
  const userId = (req as RequestWithUser).user.userId;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError("order not found");
  }
  confirmOwnership((req as RequestWithUser).user, order.user);
  order.paymentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { order }, "order updated successfully"));
}
