import { Router } from "express";
import {
	centralDashboardController,
	distributorManagementController,
	feedbackController,
	stockManagementController,
	listPickupRequestsController,
	pickupApprovalController,
	updateOrderStatusController,
	updateBulkRequestStatusController,
	updateZoneController,
} from "../controllers/adminController.js";
import { requireRole } from "../middleware/requireRole.js";

const adminRouter = Router();

adminRouter.get("/dashboard", requireRole(["ADMIN", "RC_ADMIN"]), centralDashboardController);
adminRouter.get("/stock", requireRole(["ADMIN", "RC_ADMIN"]), stockManagementController);
adminRouter.get("/distributors", requireRole(["ADMIN", "RC_ADMIN"]), distributorManagementController);
adminRouter.get("/feedback", requireRole(["ADMIN", "RC_ADMIN"]), feedbackController);
adminRouter.get("/pickup-requests", requireRole(["ADMIN", "RC_ADMIN"]), listPickupRequestsController);
adminRouter.patch("/pickup-requests/:id", requireRole(["ADMIN", "RC_ADMIN"]), pickupApprovalController);
adminRouter.patch("/orders/:id/status", requireRole(["ADMIN", "RC_ADMIN"]), updateOrderStatusController);
adminRouter.patch("/bulk-requests/:id/status", requireRole(["ADMIN", "RC_ADMIN"]), updateBulkRequestStatusController);
adminRouter.patch("/zones/:id", requireRole(["ADMIN", "RC_ADMIN"]), updateZoneController);

export default adminRouter;
