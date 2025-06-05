import { Hono } from "hono";
import authenticate from "../middlewares/auth.middleware.ts"
import * as userController from "../controllers/user.controller.ts"

const userRouter = new Hono();
userRouter.patch("/update-name", authenticate, userController.updateName);
userRouter.get("/profile", authenticate, userController.getProfile);

export { userRouter };