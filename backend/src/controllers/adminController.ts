import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

const toDashboardOrder = (order: any, idx: number) => {
	const student = order.student || {};
	const items = order.items || [];
	return {
		id: order.id,
		serial: idx + 1,
		enrollment: student.enrollmentNo || "NA",
		date: order.orderedAt || order.createdAt,
		requestedFrom: order.requestedFrom || order.hub?.name || order.hub?.id || "HQ",
		orderType: (order.orderKind || "NEW").toString().toLowerCase(),
		txnId: order.txnId || "",
		paymentMode: order.paymentMode || "UPI",
		mobile: order.mobile || student.phone || "",
		status: order.status || "Pending",
		name: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student Name",
		address: order.address || student.address || "",
		books: items.map((i: any) => i.book?.title || i.book?.isbn || "Book"),
	};
};

// Dashboard summary for HQ/RC
export const centralDashboardController = async (_req: Request, res: Response) => {
	try {
		const orders = await prisma.order.findMany({
			orderBy: { createdAt: "desc" },
			include: { student: true, hub: true, items: { include: { book: true } } },
			take: 100,
		});
		const mapped = orders.map(toDashboardOrder);
		return res.json({
			counts: {
				pendingPickup: await prisma.pickupRequest.count({ where: { status: "Pending" } }),
				orders: orders.length,
				books: await prisma.book.count(),
			},
			orders: mapped,
		});
	} catch (err) {
		console.error("centralDashboardController failed", err);
		return res.status(500).json({ message: "Unable to load dashboard" });
	}
};

// Pickup approval
export const pickupApprovalController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!["Pending", "APPROVED", "REJECTED", "COMPLETED", "Approved", "Rejected", "Completed"].includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}
	try {
		const updated = await prisma.pickupRequest.update({ where: { id: id! }, data: { status } });
		return res.json({ request: updated });
	} catch (err) {
		console.error("pickupApprovalController failed", err);
		return res.status(404).json({ message: "Request not found" });
	}
};

// List pickup requests in admin-dashboard
export const listPickupRequestsController = async (_req: Request, res: Response) => {
	const requests = await prisma.pickupRequest.findMany({ orderBy: { requestedAt: "desc" } });
	res.json({ requests });
};

// Stock management controller
export const stockManagementController = async (_req: Request, res: Response) => {
	const zones = await prisma.zone.findMany({
		include: { stocks: true, rc: true },
		orderBy: { name: "asc" },
	});
	const mapped = zones.map((z) => ({
		code: z.code,
		rc: z.rc?.code || z.rcId,
		stock: z.stocks.reduce((sum, s) => sum + s.quantity, 0),
	}));
	res.json({ zones: mapped });
};

// Manage distributions
export const distributorManagementController = async (_req: Request, res: Response) => {
	const distributors = await prisma.distributor.findMany({ include: { zone: true, orders: true } });
	const mapped = distributors.map((d) => ({
		code: d.name,
		zone: d.zone?.code,
		stock: d.orders.length,
	}));
	res.json({ distributors: mapped });
};

// Show Feedback details
export const feedbackController = async (_req: Request, res: Response) => {
	const feedback = await prisma.feedback.findMany({
		include: { user: true },
		orderBy: { createdAt: "desc" },
		take: 200,
	});
	const mapped = feedback.map((f) => ({
		id: f.id,
		name: `${f.user?.firstName || ""} ${f.user?.lastName || ""}`.trim() || f.user?.email,
		enrollment: f.enrollment,
		role: f.senderRole || f.user?.role,
		feedbackType: f.feedbackType,
		message: f.message,
		contact: f.contact,
		date: f.createdAt,
	}));
	res.json({ feedback: mapped });
};

// Update order status
export const updateOrderStatusController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body as { status?: string };
	const allowed = ["Pending", "Approved", "Cancelled", "Completed", "Dispatched", "In-Transit"];
	if (!status || !allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
	try {
		const updated = await prisma.order.update({ where: { id: id! }, data: { status } });
		return res.json({ order: updated });
	} catch (err) {
		console.error("updateOrderStatusController failed", err);
		return res.status(404).json({ message: "Order not found" });
	}
};

// Update bulk request status
export const updateBulkRequestStatusController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body as { status?: string };
	if (!status) return res.status(400).json({ message: "Status required" });
	try {
		const updated = await prisma.bulkRequest.update({ where: { id: id! }, data: { status } });
		return res.json({ bulkRequest: updated });
	} catch (err) {
		console.error("updateBulkRequestStatusController failed", err);
		return res.status(404).json({ message: "Bulk request not found" });
	}
};

// Update zone meta
export const updateZoneController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, address, phone, note, distanceKm, rcCode } = req.body as any;
	try {
		let rcId: string | undefined;
		if (rcCode) {
			const rc = await prisma.regionalCenter.findFirst({ where: { code: rcCode } });
			if (!rc) return res.status(400).json({ message: "RC not found" });
			rcId = rc.id;
		}
		const updated = await prisma.zone.update({
			where: { id: id! },
			data: { name, address, phone, note, distanceKm, ...(rcId ? { rcId } : {}) },
		});
		return res.json({ zone: updated });
	} catch (err) {
		console.error("updateZoneController failed", err);
		return res.status(404).json({ message: "Zone not found" });
	}
};
