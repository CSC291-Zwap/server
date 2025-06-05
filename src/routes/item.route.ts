import { Hono } from "hono";
import * as itemController from "../controllers/item.controller.ts"
import authenticate from "../middlewares/auth.middleware.ts"

const itemRouter = new Hono();
itemRouter.post("/new", authenticate, itemController.createItem);
itemRouter.get("/all", authenticate, itemController.getItemAll);

export { itemRouter };