import { Hono } from "hono";
import { authRouter } from "./auth.route.ts"

const mainRouter = new Hono();

mainRouter.route("/auth", authRouter);

export { mainRouter };