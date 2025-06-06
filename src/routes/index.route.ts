import { Hono } from "hono";
import { authRouter } from "./auth.route.ts"
import { itemRouter } from "./item.route.ts";
import { userRouter } from "./user.route.ts";
import { orderRouter } from "./order.route.ts";

const mainRouter = new Hono();

mainRouter.route("/auth", authRouter);
mainRouter.route("/items", itemRouter);
mainRouter.route("/user", userRouter);
mainRouter.route("/order", orderRouter );

export { mainRouter };