import { Hono } from "hono";
import * as authController from "../controllers/auth.controller.ts"

export const authRouter = new Hono();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);