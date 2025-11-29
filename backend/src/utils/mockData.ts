// Centralized mock data for prototype flows (tracking, pickup requests, catalog, zones, feedback, orders).
import { randomUUID } from "crypto";

export type PickupStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface TrackingNode {
	id: string;
	status: string;
	location: string;
	type: "HQ" | "RC" | "Zone" | "Hub";
	timestamp: string;
	note: string;
	etaDays?: number;
	allowPickup?: boolean;
}

export interface PickupRequest {
	id: string;
	enrollment: string;
	studentId: string;
	location: string;
	status: PickupStatus;
	requestedAt: string;
	notes?: string;
}

export interface CatalogBook {
	id: string;
	code: string;
	title: string;
	course: "BCA" | "BCA_OL" | "MCA_NEW" | "MCA_OL";
	isbn: string;
	price: number;
	isUsed: boolean;
	condition: "New" | "Like New" | "Good" | "Fair";
	stockZones: string[];
}

export interface Address {
	line1: string;
	city: string;
	state: string;
	pincode: string;
}

export interface OrderHistoryItem {
	id: string;
	items: { code: string; qty: number; title: string }[];
	status: string;
	orderedAt: string;
	deliveryEtaDays: number;
	currentLocation: string;
}

export interface ZoneEntry {
	id: string;
	name: string;
	code: string;
	rc: string;
	address: string;
	distanceKm: number;
	stock: number;
	note: string;
	phone: string;
}

export interface FeedbackEntry {
	id: string;
	enrollment: string;
	name: string;
	role: string;
	type: string;
	message: string;
	createdAt: string;
}

// --- Seed data ---

export let trackingDelhi: TrackingNode[] = [
	{
		id: "t1",
		status: "Dispatched",
		location: "Headquarters (Maidan Garhi)",
		type: "HQ",
		timestamp: "2025-11-24T08:15:00Z",
		note: "Bulk dispatch created for RC-01, RC-02, RC-03",
		etaDays: 5,
		allowPickup: true,
	},
	{
		id: "t2",
		status: "In Transit",
		location: "Zone Z-12 (South Delhi Hub)",
		type: "Zone",
		timestamp: "2025-11-26T10:30:00Z",
		note: "Shipment scanning completed at hub",
		etaDays: 3,
	},
	{
		id: "t3",
		status: "Arrived",
		location: "RC-02 (Dwarka)",
		type: "RC",
		timestamp: "2025-11-27T12:10:00Z",
		note: "Ready for assignment to nearest hub",
		etaDays: 2,
		allowPickup: true,
	},
	{
		id: "t4",
		status: "Ready for Pickup",
		location: "Hub H-44 (Janakpuri)",
		type: "Hub",
		timestamp: "2025-11-28T08:05:00Z",
		note: "Within 5km of destination, pickup available",
		etaDays: 1,
		allowPickup: true,
	},
	{
		id: "t5",
		status: "Out for Delivery",
		location: "Dwarka Sector 10",
		type: "Zone",
		timestamp: "2025-11-28T12:20:00Z",
		note: "Courier en route; doorstep ETA < 24h",
		etaDays: 0,
	},
];

export let pickupRequests: PickupRequest[] = [
	{
		id: "pr-1",
		enrollment: "2201234567",
		studentId: "student-1",
		location: "Hub H-44 (Janakpuri)",
		status: "PENDING",
		requestedAt: "2025-11-28T09:00:00Z",
	},
];

export const catalogBooks: CatalogBook[] = [
	{
		id: "book-1",
		code: "BCS-011",
		title: "Computer Basics",
		course: "BCA",
		isbn: "978-81-237-0110-1",
		price: 420,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-05", "Z-12", "HQ"],
	},
	{
		id: "book-2",
		code: "MCS-034",
		title: "Data Structures",
		course: "MCA_NEW",
		isbn: "978-81-237-0340-2",
		price: 280,
		isUsed: true,
		condition: "Good",
		stockZones: ["Z-18", "Z-22"],
	},
	{
		id: "book-3",
		code: "BCSL-056",
		title: "Network Lab Manual",
		course: "BCA",
		isbn: "978-81-237-0560-5",
		price: 360,
		isUsed: false,
		condition: "New",
		stockZones: ["RC-01", "HQ"],
	},
	{
		id: "book-4",
		code: "MCS-011",
		title: "Problem Solving & Programming",
		course: "MCA_OL",
		isbn: "978-81-237-0111-2",
		price: 300,
		isUsed: true,
		condition: "Like New",
		stockZones: ["Z-03", "Z-07", "HQ"],
	},
	{
		id: "book-5",
		code: "BCSL-045",
		title: "Linux Lab",
		course: "BCA",
		isbn: "978-81-237-0450-0",
		price: 250,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-01", "Z-10", "RC-03"],
	},
	{
		id: "book-6",
		code: "BCS-012",
		title: "Mathematics",
		course: "BCA",
		isbn: "978-81-237-0120-0",
		price: 390,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-05", "HQ"],
	},
	{
		id: "book-7",
		code: "BCS-031",
		title: "Database Management Systems",
		course: "BCA_OL",
		isbn: "978-81-237-0310-9",
		price: 450,
		isUsed: true,
		condition: "Good",
		stockZones: ["Z-12", "HQ"],
	},
	{
		id: "book-8",
		code: "MCS-021",
		title: "Operating Systems",
		course: "MCA_NEW",
		isbn: "978-81-237-0210-3",
		price: 520,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-18", "RC-02"],
	},
	{
		id: "book-9",
		code: "MCSL-016",
		title: "Java Lab",
		course: "MCA_OL",
		isbn: "978-81-237-0160-1",
		price: 310,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-03", "HQ"],
	},
	{
		id: "book-10",
		code: "BCSL-033",
		title: "Data Structures Lab",
		course: "BCA",
		isbn: "978-81-237-0330-0",
		price: 330,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-07", "RC-01"],
	},
	{
		id: "book-11",
		code: "BCS-040",
		title: "Statistical Techniques",
		course: "BCA_OL",
		isbn: "978-81-237-0400-1",
		price: 280,
		isUsed: true,
		condition: "Fair",
		stockZones: ["Z-10", "HQ"],
	},
	{
		id: "book-12",
		code: "MCS-013",
		title: "Discrete Mathematics",
		course: "MCA_NEW",
		isbn: "978-81-237-0130-5",
		price: 480,
		isUsed: false,
		condition: "New",
		stockZones: ["Z-05", "Z-12"],
	},
	{
		id: "book-13",
		code: "MCS-042",
		title: "Linux Administration",
		course: "MCA_OL",
		isbn: "978-81-237-0420-4",
		price: 510,
		isUsed: true,
		condition: "Like New",
		stockZones: ["Z-01", "RC-03"],
	},
];

export const defaultAddress: Address = {
	line1: "Flat 402, Sapphire Residency",
	city: "New Delhi",
	state: "Delhi",
	pincode: "110077",
};

export let orderHistory: OrderHistoryItem[] = [
	{
		id: "ord-1",
		items: [
			{ code: "BCS-011", qty: 1, title: "Computer Basics" },
			{ code: "MCS-034", qty: 1, title: "Data Structures" },
		],
		status: "Delivered",
		orderedAt: "2025-11-12T10:00:00Z",
		deliveryEtaDays: 0,
		currentLocation: "Delivered at Dwarka Sector 10",
	},
	{
		id: "ord-2",
		items: [{ code: "BCSL-056", qty: 1, title: "Network Lab Manual" }],
		status: "In Transit",
		orderedAt: "2025-11-25T15:00:00Z",
		deliveryEtaDays: 2,
		currentLocation: "Zone Z-12 (South Delhi Hub)",
	},
];

export const zones: ZoneEntry[] = [
	{ id: "zone-01", name: "Central Hub", code: "Z-01", rc: "RC-01", address: "Block B, Connaught Place, New Delhi 110001", distanceKm: 4, stock: 320, note: "Major zone", phone: "+91-98100-00001" },
	{ id: "zone-02", name: "Karol Bagh Hub", code: "Z-02", rc: "RC-01", address: "DB Gupta Road, Karol Bagh, New Delhi 110005", distanceKm: 6, stock: 280, note: "RC manages deliveries", phone: "+91-98100-00002" },
	{ id: "zone-03", name: "Model Town Hub", code: "Z-03", rc: "RC-01", address: "Ring Road, Model Town 2, Delhi 110009", distanceKm: 8, stock: 250, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00003" },
	{ id: "zone-04", name: "Rohini Sector 3", code: "Z-04", rc: "RC-03", address: "Pocket A, Rohini Sector 3, Delhi 110085", distanceKm: 12, stock: 260, note: "Self pickup only", phone: "+91-98100-00004" },
	{ id: "zone-05", name: "Pitampura Hub", code: "Z-05", rc: "RC-03", address: "NSP, Pitampura, Delhi 110034", distanceKm: 10, stock: 270, note: "RC manages deliveries", phone: "+91-98100-00005" },
	{ id: "zone-06", name: "Janakpuri Hub", code: "Z-06", rc: "RC-02", address: "C-2 Block, Janakpuri, New Delhi 110058", distanceKm: 7, stock: 300, note: "Major zone", phone: "+91-98100-00006" },
	{ id: "zone-07", name: "Dwarka Sector 7", code: "Z-07", rc: "RC-02", address: "Pocket 2, Dwarka Sector 7, New Delhi 110075", distanceKm: 9, stock: 310, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00007" },
	{ id: "zone-08", name: "Dwarka Sector 10", code: "Z-08", rc: "RC-02", address: "Metro View, Dwarka Sector 10, New Delhi 110075", distanceKm: 11, stock: 295, note: "Self pickup only", phone: "+91-98100-00008" },
	{ id: "zone-09", name: "Vikas Puri Hub", code: "Z-09", rc: "RC-02", address: "PVR Road, Vikas Puri, New Delhi 110018", distanceKm: 6, stock: 285, note: "RC manages deliveries", phone: "+91-98100-00009" },
	{ id: "zone-10", name: "Saket Hub", code: "Z-10", rc: "RC-02", address: "Mandir Marg, Saket, New Delhi 110017", distanceKm: 14, stock: 275, note: "Major zone", phone: "+91-98100-00010" },
	{ id: "zone-11", name: "Vasant Kunj Hub", code: "Z-11", rc: "RC-02", address: "Pocket B, Vasant Kunj, New Delhi 110070", distanceKm: 15, stock: 260, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00011" },
	{ id: "zone-12", name: "South Delhi Hub", code: "Z-12", rc: "RC-02", address: "IGNOU Road, Maidan Garhi, New Delhi 110068", distanceKm: 5, stock: 340, note: "Major zone", phone: "+91-98100-00012" },
	{ id: "zone-13", name: "Okhla Phase 1", code: "Z-13", rc: "RC-01", address: "Industrial Area, Okhla Phase 1, New Delhi 110020", distanceKm: 9, stock: 245, note: "Self pickup only", phone: "+91-98100-00013" },
	{ id: "zone-14", name: "Lajpat Nagar Hub", code: "Z-14", rc: "RC-01", address: "Ring Road, Lajpat Nagar 4, New Delhi 110024", distanceKm: 7, stock: 255, note: "RC manages deliveries", phone: "+91-98100-00014" },
	{ id: "zone-15", name: "Kalkaji Hub", code: "Z-15", rc: "RC-01", address: "Main Road, Kalkaji, New Delhi 110019", distanceKm: 8, stock: 240, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00015" },
	{ id: "zone-16", name: "Mayur Vihar Phase 1", code: "Z-16", rc: "RC-01", address: "Pocket A, Mayur Vihar Phase 1, Delhi 110091", distanceKm: 13, stock: 235, note: "Self pickup only", phone: "+91-98100-00016" },
	{ id: "zone-17", name: "Preet Vihar Hub", code: "Z-17", rc: "RC-01", address: "Vikas Marg, Preet Vihar, Delhi 110092", distanceKm: 15, stock: 225, note: "RC manages deliveries", phone: "+91-98100-00017" },
	{ id: "zone-18", name: "Noida Border Hub", code: "Z-18", rc: "RC-01", address: "Chilla Village, Delhi 110096", distanceKm: 18, stock: 215, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00018" },
	{ id: "zone-19", name: "Shahdara Hub", code: "Z-19", rc: "RC-03", address: "GT Road, Shahdara, Delhi 110032", distanceKm: 16, stock: 230, note: "Self pickup only", phone: "+91-98100-00019" },
	{ id: "zone-20", name: "Yamuna Vihar Hub", code: "Z-20", rc: "RC-03", address: "C Block, Yamuna Vihar, Delhi 110053", distanceKm: 17, stock: 220, note: "RC manages deliveries", phone: "+91-98100-00020" },
	{ id: "zone-21", name: "Ghaziabad Border", code: "Z-21", rc: "RC-03", address: "Mohan Nagar, Ghaziabad Border, Ghaziabad 201007", distanceKm: 20, stock: 210, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00021" },
	{ id: "zone-22", name: "Najafgarh Hub", code: "Z-22", rc: "RC-02", address: "Old Roshanpura, Najafgarh, New Delhi 110043", distanceKm: 19, stock: 205, note: "Self pickup only", phone: "+91-98100-00022" },
	{ id: "zone-23", name: "Uttam Nagar Hub", code: "Z-23", rc: "RC-02", address: "Matiala Road, Uttam Nagar, New Delhi 110059", distanceKm: 8, stock: 245, note: "RC manages deliveries", phone: "+91-98100-00023" },
	{ id: "zone-24", name: "Palam Hub", code: "Z-24", rc: "RC-02", address: "Palam Village, South West Delhi 110010", distanceKm: 10, stock: 235, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00024" },
	{ id: "zone-25", name: "Mehrauli Hub", code: "Z-25", rc: "RC-02", address: "Ward 1, Mehrauli, New Delhi 110030", distanceKm: 6, stock: 255, note: "Major zone", phone: "+91-98100-00025" },
];

export const feedbackEntries: FeedbackEntry[] = [
	{
		id: "fb-1",
		enrollment: "2201234567",
		name: "Amit Sharma",
		role: "STUDENT",
		type: "Delivery",
		message: "Pickup from Janakpuri hub confirmed.",
		createdAt: "2025-11-28T09:10:00Z",
	},
	{
		id: "fb-2",
		enrollment: "D-12",
		name: "South Delhi Distributor",
		role: "DISTRIBUTOR",
		type: "Stock",
		message: "Need 40 copies of BCS-011.",
		createdAt: "2025-11-28T09:20:00Z",
	},
];

export const addPickupRequest = (payload: Omit<PickupRequest, "id" | "requestedAt" | "status">) => {
	const record: PickupRequest = {
		...payload,
		id: randomUUID(),
		status: "PENDING",
		requestedAt: new Date().toISOString(),
	};
	pickupRequests = [record, ...pickupRequests];
	return record;
};

export const updatePickupStatus = (id: string, status: PickupStatus) => {
	pickupRequests = pickupRequests.map((p) => (p.id === id ? { ...p, status } : p));
	return pickupRequests.find((p) => p.id === id);
};

export const addFeedback = (entry: Omit<FeedbackEntry, "id" | "createdAt">) => {
	const record: FeedbackEntry = {
		...entry,
		id: randomUUID(),
		createdAt: new Date().toISOString(),
	};
	feedbackEntries.push(record);
	return record;
};

export const addOrder = (items: { code: string; qty: number; title: string }[], address: Address) => {
	const record: OrderHistoryItem = {
		id: randomUUID(),
		items,
		status: "Pending Approval",
		orderedAt: new Date().toISOString(),
		deliveryEtaDays: 3,
		currentLocation: `Awaiting dispatch from ${address.city}`,
	};
	orderHistory = [record, ...orderHistory];
	trackingDelhi = [
		{
			id: `order-${record.id}`,
			status: "Order Placed",
			location: `${address.city}, ${address.state}`,
			type: "HQ",
			timestamp: record.orderedAt,
			note: `New order created with ${items.length} item(s)`,
			etaDays: 3,
			allowPickup: true,
		},
		...trackingDelhi,
	];
	return record;
};

export const getTracking = () => trackingDelhi;
