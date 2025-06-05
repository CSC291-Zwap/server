import { Hono } from "hono";
import { authRouter } from "./auth.route.ts"
import { itemRouter } from "./item.route.ts";

const mainRouter = new Hono();

mainRouter.route("/auth", authRouter);
mainRouter.route("/items", itemRouter);

export { mainRouter };