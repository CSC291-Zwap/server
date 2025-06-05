import type { Context } from "hono";
import * as itemModel from "../models/item.model.ts";
import type { Category } from "../generated/prisma/index.js";

type createItemBody = {
  prodName: string;
  prodDesc: string;
  price: number;
  pickup: string;
  city: string;
  category: Category;
  imageUrl: string[];
};

export const createItem = async (c: Context) => {
  try {
    const body = await c.req.json<createItemBody>();

    const userId = c.get("userId");

    if (!body.prodName || !body.price || !body.pickup || !body.city || !userId) {
      return c.json({
        msg: "Missing required fields.",
      }, 400);
    }

    const newItem = await itemModel.createItem({...body, userId});

    return c.json({
      data: newItem,
      msg: "Item created successfully!",
    }, 201);

  } catch (e) {
    console.error("Error creating item:", e);
    return c.json({
      msg: "Internal server error.",
    }, 500);
  }
};