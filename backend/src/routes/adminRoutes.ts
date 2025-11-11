import { Router } from "express";
import {
	centralDashboardController,
	distributorManagementController,
	feedbackController,
	stockManagementController,
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/dashboard", centralDashboardController);
adminRouter.get("/stock", stockManagementController);
adminRouter.get("/distributors", distributorManagementController);
adminRouter.post("/feedback", feedbackController);

export default adminRouter;