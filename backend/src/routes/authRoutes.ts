import { Router } from "express";
import { loginController, registerController, logoutController } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.get("/logout", logoutController);

export default authRouter;