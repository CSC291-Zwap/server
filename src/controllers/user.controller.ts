import type { Context } from "hono";
import { getUserInfo, updateUserName } from "../models/user.model.ts";

export const getProfile = async (c: Context) => {
  // console.log("Fetching user profile...");
  try {
    const userId = c.get("userId");

    const user = await getUserInfo(userId);

    if (!user) {
      return c.json({ msg: "User not found." }, 404);
    }

    return c.json({ user }, 200);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return c.json({ msg: "Internal server error." }, 500);
  }
};

export const updateName = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json<{ name: string }>();

    if (!body.name) {
      return c.json({ msg: "Name is required." }, 400);
    }

    const updated = await updateUserName(userId, body.name);

    return c.json({
      msg: "Name updated successfully!",
      user: updated,
    }, 200);
  } catch (error) {
    console.error("Error updating user name:", error);
    return c.json({ msg: "Internal server error." }, 500);
  }
};