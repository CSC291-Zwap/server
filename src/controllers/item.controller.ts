import type { Context } from "hono";
import * as itemModel from "../models/item.model.ts";
import type { Category } from "../generated/prisma/index.js";

type createItemBody = {
  prod_name: string;
  description: string;
  price: number;
  pick_up: string;
  city: string;
  category: Category;
  userId: string; // Ensure userId is a string
  imageUrls: string[];
};

export const createItem = async (c: Context) => {
  try {
    const body = await c.req.json<createItemBody>();
    const userId = c.get("userId");

    if (!body.prod_name || !body.price || !body.pick_up || !body.city || !body.userId) {
      return c.json({
        msg: "Missing required fields.",
      }, 400);
    }

    const newItem = await itemModel.createItem({
      prodName: body.prod_name,
      prodDesc: body.description,
      price: body.price,
      pickup: body.pick_up,
      city: body.city,
      category: body.category || "fashion", // Default to 'fashion' if not provided
      userId: userId as string, // Ensure userId is a string 
      imageUrls: body.imageUrls || [], // Use imageUrl array or default to empty array
      });

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

export const getItemAll = async (c: Context) => {
  try {
    const items = await itemModel.getItemAll();
    return c.json({
      data: items,
      msg: "Items fetched successfully!",
    }, 200);
  } catch (error) {
    console.error("Error fetching items:", error);
    return c.json({
      msg: "Internal server error.",
    }, 500);
  }
};

export const deleteItem = async (c: Context) => {
  try {
    const itemId = c.req.param("id");

    if (!itemId) {
      return c.json({ msg: "Item ID is required." }, 400);
    }

    const deleted = await itemModel.deleteItembyId(itemId);
    return c.json({
      data: deleted,
      msg: "Item deleted successfully.",
    }, 200);
  } catch (error) {
    console.error("Error deleting item:", error);
    return c.json({ msg: "Internal server error." }, 500);
  }
};

export const updateItem = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<Partial<createItemBody>>();

    if (!id) {
      return c.json({ msg: "Item ID is required." }, 400);
    }

    const updated = await itemModel.updateItem(id, body);
    return c.json({
      data: updated,
      msg: "Item updated successfully!",
    }, 200);
  } catch (error) {
    console.error("Error updating item:", error);
    return c.json({ msg: "Internal server error." }, 500);
  }
};

export const getCategoryList = async (c: Context) => {
  try {
    const categories = await itemModel.getCategory();
    return c.json({ categories }, 200);
  } catch (error) {
    return c.json({ msg: "Failed to fetch categories." }, 500);
  }
};