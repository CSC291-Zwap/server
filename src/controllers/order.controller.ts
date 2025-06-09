import type { Context } from "hono";
import { getOrdersByUserId, createOrder } from "../models/order.model.ts";

export const getOrders = async (c: Context) => {
  try {
    const userId = c.get("userId");

    const { buyerOrders, sellerOrders } = await getOrdersByUserId(userId);

    return c.json(
      {
        ordersAsBuyer: buyerOrders,
        ordersAsSeller: sellerOrders,
      },
      200
    );
  } catch (error) {
    console.error("Error getting orders:", error);
    return c.json({ msg: "Failed to fetch orders." }, 500);
  }
};

export const createOrderController = async (c: Context) => {
  try {
    const buyerId = c.get("userId");
    const body = await c.req.json<{ itemId: string }>();

    if (!body.itemId) {
      return c.json({ msg: "itemId is required" }, 400);
    }

    const newOrder = await createOrder(body.itemId, buyerId);

    return c.json({
      msg: "Order created successfully.",
      order: newOrder,
    }, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ msg: "Failed to create order." }, 500);
  }
};