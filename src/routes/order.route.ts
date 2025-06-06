import { Hono } from "hono";
import authenticate from "../middlewares/auth.middleware.ts"
import * as orderController from "../controllers/order.controller.ts"

const orderRouter = new Hono();
orderRouter.get("/user", authenticate, orderController.getOrders);
orderRouter.post("/item", authenticate, orderController.createOrderController);

export { orderRouter };