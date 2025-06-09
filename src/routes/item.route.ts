import { Hono } from "hono";
import * as itemController from "../controllers/item.controller.ts"
import authenticate from "../middlewares/auth.middleware.ts"

const itemRouter = new Hono();
itemRouter.post("/new", authenticate, itemController.createItem);
itemRouter.get("/all", itemController.getItemAll);
itemRouter.delete("/:id", authenticate, itemController.deleteItem);
itemRouter.patch("/update/:id", authenticate, itemController.updateItem);
itemRouter.get("/category", itemController.getCategoryList);

export { itemRouter };