import { Router } from "express";
import {
	centralDashboardController,
	distributorManagementController,
	feedbackController,
	stockManagementController,
	listPickupRequestsController,
	pickupApprovalController,
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/dashboard", centralDashboardController);
adminRouter.get("/stock", stockManagementController);
adminRouter.get("/distributors", distributorManagementController);
adminRouter.post("/feedback", feedbackController);
adminRouter.get("/pickup-requests", listPickupRequestsController);
adminRouter.patch("/pickup-requests/:id", pickupApprovalController);

export default adminRouter;
