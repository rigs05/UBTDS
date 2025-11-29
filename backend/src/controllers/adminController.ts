import type { Request, Response } from "express";
import {
	catalogBooks,
	orderHistory,
	pickupRequests,
	updatePickupStatus,
	feedbackEntries,
	zones,
} from "../utils/mockData.js";

// Dashboard summary for HQ/RC
export const centralDashboardController = (_req: Request, res: Response) => {
	res.json({
		counts: {
			pendingPickup: pickupRequests.filter((p) => p.status === "PENDING").length,
			orders: orderHistory.length,
			books: catalogBooks.length,
		},
		orders: orderHistory,
	});
};

// Pickup approval
export const pickupApprovalController = (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!["PENDING", "APPROVED", "REJECTED", "COMPLETED"].includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}
	const updated = updatePickupStatus(id, status);
	if (!updated) return res.status(404).json({ message: "Request not found" });
	return res.json({ request: updated });
};

export const listPickupRequestsController = (_req: Request, res: Response) => {
	res.json({ requests: pickupRequests });
};

export const stockManagementController = (_req: Request, res: Response) => {
	res.json({
		zones: zones.map((z) => ({ code: z.code, rc: z.rc, stock: z.stock })),
	});
};

export const distributorManagementController = (_req: Request, res: Response) => {
	res.json({
		distributors: zones.slice(0, 25).map((z, idx) => ({
			code: `D-${z.code}`,
			zone: z.code,
			stock: z.stock - idx * 5,
		})),
	});
};

export const feedbackController = (_req: Request, res: Response) => {
	res.json({ feedback: feedbackEntries });
};
