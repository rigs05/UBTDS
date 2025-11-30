import { Router } from "express";
import {
	booksTrackingController,
	catalogController,
	checkoutController,
	feedbackController,
	orderHistoryController,
	requestPickupController,
	studentProfileController,
	zonesController,
	listPickupRequestsController,
	updatePickupController,
	listFeedbackController,
} from "../controllers/studentController.js";
import { requireRole } from "../middleware/requireRole.js";

const studentRouter = Router();

studentRouter.get("/profile", studentProfileController);
studentRouter.get("/track", booksTrackingController);
studentRouter.post("/pickup-request", requestPickupController);
studentRouter.get("/pickup-request", listPickupRequestsController);
studentRouter.patch("/pickup-request/:id", requireRole(["ADMIN", "RC_ADMIN"]), updatePickupController);
studentRouter.get("/orders/history", orderHistoryController);
studentRouter.post("/orders/checkout", checkoutController);
studentRouter.get("/catalog", catalogController);
studentRouter.post("/feedback", feedbackController);
studentRouter.get("/feedback", listFeedbackController);
studentRouter.get("/zones", zonesController);

export default studentRouter;
