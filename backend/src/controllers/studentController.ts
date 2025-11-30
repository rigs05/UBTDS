import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

// Student profile info + default RC/Zone enrichment
export const studentProfileController = async (req: Request, res: Response) => {
	const tokenUser = (req as any).user || {};
	try {
		const dbUser = await prisma.user.findUnique({
			where: { id: tokenUser.id },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				enrollmentNo: true,
				phone: true,
				address: true,
				rc: { select: { code: true, name: true } },
				zone: { select: { code: true, name: true } },
			},
		});
		if (!dbUser) return res.status(404).json({ message: "User not found" });
		const addrString = dbUser.address || "";
		const defaultAddr = {
			line1: addrString || "New Delhi",
			city: "New Delhi",
			state: "Delhi",
			pincode: "110001",
		};
		return res.json({
			...dbUser,
			address: defaultAddr,
			rcName: dbUser.rc?.name,
			rcCode: dbUser.rc?.code,
			zoneCode: dbUser.zone?.code,
		});
	} catch (err) {
		console.error("studentProfileController failed", err);
		return res.status(500).json({ message: "Unable to load profile" });
	}
};

// Tracking timeline for Delhi region
export const booksTrackingController = (_req: Request, res: Response) => {
	res.json({
		region: "Delhi",
		rc: "RC-02",
		currentLocation: "HQ",
		timeline: [],
	});
};

// Student pickup request (creates an approval item)
export const requestPickupController = async (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const { location, notes } = req.body;
	if (!location) return res.status(400).json({ message: "Pickup location is required." });
	// Resolve enrollment from authenticated user or DB fallback
	let enrollment = user.enrollmentNo || user.enrollment;
	if (!enrollment && user.id) {
		const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { enrollmentNo: true } });
		enrollment = dbUser?.enrollmentNo;
	}
	if (!enrollment && req.body?.enrollment) enrollment = req.body.enrollment;
	const record = await prisma.pickupRequest.create({
		data: {
			enrollment: enrollment || "NA",
			location,
			status: "Pending",
		},
	});
	res.status(201).json({ request: { ...record, notes } });
};

// Student order history
export const orderHistoryController = async (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const orders = await prisma.order.findMany({
		where: { studentId: user.id },
		include: { items: { include: { book: true } } },
		orderBy: { createdAt: "desc" },
	});
	const mapped = orders.map((o) => ({
		id: o.id,
		status: o.status,
		orderType: o.orderType,
		txnId: o.txnId,
		paymentMode: o.paymentMode,
		items: o.items.map((i) => ({ title: i.book?.title, quantity: i.quantity })),
		createdAt: o.createdAt,
	}));
	res.json({ orders: mapped });
};

// Catalog
export const catalogController = async (_req: Request, res: Response) => {
	try {
		const books = await prisma.book.findMany({
			include: { course: true },
			orderBy: { title: "asc" },
			take: 100,
		});
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
	} catch (err) {
		console.error("Catalog fetch failed", err);
		return res.status(500).json({ message: "Unable to load catalog" });
	}
};

// Checkout / create order
export const checkoutController = async (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const { items, address, paymentMode } = req.body;
	if (!Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ message: "At least one item is required." });
	}
	try {
		// Resolve book ids safely (id, bookId, or isbn/code lookup)
		const resolvedItems = [];
		for (const raw of items) {
			let bookId = raw.bookId || raw.id;
			if (!bookId) {
				const codeOrTitle = raw.code || raw.isbn || raw.title;
				if (codeOrTitle) {
					const found = await prisma.book.findFirst({
						where: {
							OR: [{ isbn: codeOrTitle }, { title: codeOrTitle }],
						},
					});
					if (found) bookId = found.id;
				}
			}
			if (!bookId) return res.status(400).json({ message: "Invalid item payload (missing bookId)." });
			const quantity = raw.quantity || raw.qty || 1;
			resolvedItems.push({ bookId, quantity });
		}

		const allowedPayments = ["UPI", "CREDIT_CARD", "DEBIT_CARD", "NETBANKING", "NEFT", "DEMAND_DRAFT", "PO"];
		const normalizedPayment =
			allowedPayments.find((p) => p.toLowerCase() === String(paymentMode || "").toLowerCase()) || "UPI";

		const addressString =
			typeof address === "string"
				? address
				: address
				? [address.line1, address.city, address.state, address.pincode].filter(Boolean).join(", ")
				: user.address || "";

		const record = await prisma.order.create({
			data: {
				studentId: user.id,
				status: "Pending",
				orderType: "INDIVIDUAL",
				orderKind: "NEW",
				paymentMode: normalizedPayment as any,
				address: addressString,
				items: { create: resolvedItems },
			},
		});
		res.status(201).json({ order: record });
	} catch (err) {
		console.error("Checkout failed", err);
		res.status(500).json({ message: "Unable to place order right now." });
	}
};

// Feedback submission
export const feedbackController = async (req: Request, res: Response) => {
	const user = (req as any).user || {};
	const { enrollment, name, feedbackType, message, contact } = req.body;
	if (!message) return res.status(400).json({ message: "Feedback message is required." });
	const entry = await prisma.feedback.create({
		data: {
			userId: user.id,
			message,
			feedbackType: feedbackType || "General",
			contact: contact || user.phone,
			enrollment: enrollment || user.enrollmentNo,
			senderRole: user.role,
		},
	});
	res.status(201).json({ feedback: entry });
};

// Zones list with nearest prioritized
export const zonesController = async (_req: Request, res: Response) => {
	const zones = await prisma.zone.findMany({
		include: { rc: true, stocks: true },
		orderBy: { distanceKm: "asc" },
	});
	const mapped = zones.map((z) => ({
		id: z.id,
		code: z.code,
		rc: z.rc?.code || z.rcId,
		name: z.name,
		address: z.address,
		phone: z.phone,
		distanceKm: z.distanceKm,
		note: z.note,
		stock: z.stocks.reduce((sum, s) => sum + s.quantity, 0),
		rating: z.rating,
	}));
	res.json({ zones: mapped, nearest: mapped[0] });
};

// Pickup request status update (admin)
export const updatePickupController = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!["Pending", "APPROVED", "REJECTED", "COMPLETED", "Approved", "Rejected", "Completed"].includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}
	const updated = await prisma.pickupRequest.update({ where: { id: id! }, data: { status } });
	res.json({ request: updated });
};

// Admin view of pickup requests
export const listPickupRequestsController = async (_req: Request, res: Response) => {
	const user = (_req as any).user || {};
	const where = user?.enrollmentNo ? { enrollment: user.enrollmentNo } : {};
	const requests = await prisma.pickupRequest.findMany({ where, orderBy: { requestedAt: "desc" } });
	res.json({ requests });
};

// Feedback list for admin visibility
export const listFeedbackController = async (_req: Request, res: Response) => {
	const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
	res.json({ feedback });
};
