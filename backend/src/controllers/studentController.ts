import type { Request, Response } from "express";
import {
	addFeedback,
	addOrder,
	addPickupRequest,
	defaultAddress,
	catalogBooks,
	orderHistory,
	getTracking,
	updatePickupStatus,
	zones,
	feedbackEntries,
	pickupRequests,
} from "../utils/mockData.js";
import { prisma } from "../config/db.js";

// Student profile info + default RC/Zone enrichment
export const studentProfileController = (req: Request, res: Response) => {
	const user = (req as any).user || {};
	res.json({
		...user,
		rcCode: "RC-02",
		rcName: "RC-02 (Dwarka)",
		zoneCode: "Z-12",
		address: defaultAddress,
	});
};

// Tracking timeline for Delhi region
export const booksTrackingController = (_req: Request, res: Response) => {
	res.json({
		region: "Delhi",
		rc: "RC-02",
		currentLocation: getTracking()[getTracking().length - 1]?.location,
		timeline: getTracking(),
	});
};

// Student pickup request (creates an approval item)
export const requestPickupController = (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const { location, notes } = req.body;
	if (!location) return res.status(400).json({ message: "Pickup location is required." });
	const record = addPickupRequest({
		enrollment: user.enrollmentNo || "NA",
		studentId: user.id || "anonymous",
		location,
		notes,
	});
	res.status(201).json({ request: record });
};

// Student order history
export const orderHistoryController = (_req: Request, res: Response) => {
	res.json({ orders: orderHistory });
};

// Catalog
export const catalogController = async (_req: Request, res: Response) => {
	try {
		const books = await prisma.book.findMany({
			include: { course: true },
			orderBy: { title: "asc" },
			take: 100,
		});
		if (books.length) {
			const mapped = books.map((b) => ({
				id: b.id,
				code: b.isbn || b.title,
				title: b.title,
				course: (b.course?.title as any) || "BCA",
				isbn: b.isbn || "",
				price: b.price || 0,
				isUsed: b.condition === "USED",
				condition: b.condition === "USED" ? "Used" : "New",
				stockZones: ["HQ"],
			}));
			return res.json({ books: mapped });
		}
		return res.json({ books: catalogBooks });
	} catch (err) {
		console.error("Catalog fetch failed", err);
		return res.json({ books: catalogBooks });
	}
};

// Checkout / create order
export const checkoutController = (req: Request, res: Response) => {
	const { items, address } = req.body;
	if (!Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ message: "At least one item is required." });
	}
	const record = addOrder(items, address || defaultAddress);
	res.status(201).json({ order: record });
};

// Feedback submission
export const feedbackController = (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const { enrollment, name, feedbackType, message } = req.body;
	if (!message) return res.status(400).json({ message: "Feedback message is required." });
	const entry = addFeedback({
		enrollment: enrollment || user.enrollmentNo || "NA",
		name: name || `${user.firstName || "User"}`,
		role: user.role || "STUDENT",
		type: feedbackType || "General",
		message,
	});
	res.status(201).json({ feedback: entry });
};

// Zones list with nearest prioritized
export const zonesController = (_req: Request, res: Response) => {
	const sorted = [...zones].sort((a, b) => a.distanceKm - b.distanceKm);
	res.json({ zones: sorted, nearest: sorted[0] });
};

// Pickup request status update (admin)
export const updatePickupController = (req: Request, res: Response) => {
 	const { id } = req.params;
	const { status } = req.body;
	if (!["PENDING", "APPROVED", "REJECTED", "COMPLETED"].includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}
	const updated = updatePickupStatus(id as string, status);
	if (!updated) return res.status(404).json({ message: "Request not found" });
	res.json({ request: updated });
};

// Admin view of pickup requests
export const listPickupRequestsController = (_req: Request, res: Response) => {
	res.json({ requests: pickupRequests });
};

// Feedback list for admin visibility
export const listFeedbackController = (_req: Request, res: Response) => {
	res.json({ feedback: feedbackEntries });
};
