import { Router } from "express";
import {
	loginController,
	logoutController,
	registerController,
	sessionController,
} from "../controllers/authController.js";
import { requireRole } from "../middleware/requireRole.js";
import { verifyToken } from "../middleware/verify.js";

const authRouter = Router();

// Public: student registration
authRouter.post("/register", registerController);

// Admin-only: admin registration must come from an authenticated admin
authRouter.post("/register/admin", verifyToken, requireRole(["ADMIN"]), registerController);

authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/me", verifyToken, sessionController);

export default authRouter;
