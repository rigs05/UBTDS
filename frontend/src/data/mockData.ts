// Mock data powering prototype UI flows across tracking, catalog, dashboards, and analytics.
import type { Role } from "../utils/types";

export interface TrackingEvent {
	id: string;
	status: "Dispatched" | "In Transit" | "Arrived" | "Ready for Pickup" | "Out for Delivery";
	location: string;
	type: "HQ" | "RC" | "Zone" | "Hub";
	timestamp: string;
	note: string;
	etaDays?: number;
	allowPickup?: boolean;
}

export interface BookItem {
	id: string;
	code: string;
	title: string;
	course: "BCA" | "BCA_OL" | "MCA_NEW" | "MCA_OL";
	isbn: string;
	isUsed: boolean;
	condition: "Like New" | "Good" | "Fair" | "New";
	price: number;
	stockZones: string[];
}

export interface DashboardEntry {
	name: string;
	serial: number;
	enrollment: string;
	date: string;
	requestedFrom: string;
	orderType: "new" | "old" | "mixed";
	txnId: string;
	paymentMode: "UPI" | "Card" | "Cash";
	mobile: string;
	status: string;
	address: string;
	books?: string[];
}

export interface BulkRequest {
	id: string;
	requestor: string;
	role: Role;
	book: string;
	count: number;
	note: string;
	payment: "UPI" | "Card" | "PO" | "NEFT";
	status: string;
	date: string;
}

export interface ZoneInfo {
	id: string;
	name: string;
	rc: string;
	zone: string;
	avgRating: number;
	booksSentThisMonth: number;
	booksSentLastMonth: number;
	stock: number;
	location: string;
}

export const trackingEventsDelhi: TrackingEvent[] = [
	{
		id: "evt-1",
		status: "Dispatched",
		location: "Headquarters (Maidan Garhi)",
		type: "HQ",
		timestamp: "2025-11-24T08:15:00Z",
		note: "Bulk dispatch created for RC-01, RC-02, RC-03",
		etaDays: 5,
		allowPickup: true,
	},
	{
		id: "evt-2",
		status: "In Transit",
		location: "Zone Z-12 (South Delhi Hub)",
		type: "Zone",
		timestamp: "2025-11-26T10:30:00Z",
		note: "Shipment scanning completed at hub",
		etaDays: 3,
	},
	{
		id: "evt-3",
		status: "Arrived",
		location: "RC-02 (Dwarka)",
		type: "RC",
		timestamp: "2025-11-27T12:10:00Z",
		note: "Ready for assignment to nearest hub",
		etaDays: 2,
		allowPickup: true,
	},
	{
		id: "evt-4",
		status: "Ready for Pickup",
		location: "Hub H-44 (Janakpuri)",
		type: "Hub",
		timestamp: "2025-11-28T08:05:00Z",
		note: "Within 5km of destination, pickup available",
		etaDays: 1,
		allowPickup: true,
	},
	{
		id: "evt-5",
		status: "Out for Delivery",
		location: "Dwarka Sector 10",
		type: "Zone",
		timestamp: "2025-11-28T12:20:00Z",
		note: "Courier en route; doorstep ETA < 24h",
		etaDays: 0,
	},
];

export const referenceStrip = [
	{ code: "BCS-011", title: "Computer Basics", eta: "Ready in 1 day" },
	{ code: "MCS-034", title: "Data Structures", eta: "Ready in 2 days" },
	{ code: "BCSL-056", title: "Network Lab Manual", eta: "Pickup today" },
];

export const bookCatalog: BookItem[] = [
	{
		id: "book-1",
		code: "BCS-011",
		title: "Computer Basics",
		course: "BCA",
		isbn: "978-81-237-0110-1",
		isUsed: false,
		condition: "New",
		price: 420,
		stockZones: ["Z-05", "Z-12", "HQ"],
	},
	{
		id: "book-2",
		code: "MCS-034",
		title: "Data Structures",
		course: "MCA_NEW",
		isbn: "978-81-237-0340-2",
		isUsed: true,
		condition: "Good",
		price: 280,
		stockZones: ["Z-18", "Z-22"],
	},
	{
		id: "book-3",
		code: "BCSL-056",
		title: "Network Lab Manual",
		course: "BCA",
		isbn: "978-81-237-0560-5",
		isUsed: false,
		condition: "New",
		price: 360,
		stockZones: ["RC-01", "HQ"],
	},
	{
		id: "book-4",
		code: "MCS-011",
		title: "Problem Solving & Programming",
		course: "MCA_OL",
		isbn: "978-81-237-0111-2",
		isUsed: true,
		condition: "Like New",
		price: 300,
		stockZones: ["Z-03", "Z-07", "HQ"],
	},
	{
		id: "book-5",
		code: "BCSL-045",
		title: "Linux Lab",
		course: "BCA",
		isbn: "978-81-237-0450-0",
		isUsed: false,
		condition: "New",
		price: 250,
		stockZones: ["Z-01", "Z-10", "RC-03"],
	},
	{
		id: "book-6",
		code: "BCS-012",
		title: "Mathematics",
		course: "BCA",
		isbn: "978-81-237-0120-0",
		isUsed: false,
		condition: "New",
		price: 390,
		stockZones: ["Z-05", "HQ"],
	},
	{
		id: "book-7",
		code: "BCS-031",
		title: "Database Management Systems",
		course: "BCA_OL",
		isbn: "978-81-237-0310-9",
		isUsed: true,
		condition: "Good",
		price: 450,
		stockZones: ["Z-12", "HQ"],
	},
	{
		id: "book-8",
		code: "MCS-021",
		title: "Operating Systems",
		course: "MCA_NEW",
		isbn: "978-81-237-0210-3",
		isUsed: false,
		condition: "New",
		price: 520,
		stockZones: ["Z-18", "RC-02"],
	},
	{
		id: "book-9",
		code: "MCSL-016",
		title: "Java Lab",
		course: "MCA_OL",
		isbn: "978-81-237-0160-1",
		isUsed: false,
		condition: "New",
		price: 310,
		stockZones: ["Z-03", "HQ"],
	},
	{
		id: "book-10",
		code: "BCSL-033",
		title: "Data Structures Lab",
		course: "BCA",
		isbn: "978-81-237-0330-0",
		isUsed: false,
		condition: "New",
		price: 330,
		stockZones: ["Z-07", "RC-01"],
	},
	{
		id: "book-11",
		code: "BCS-040",
		title: "Statistical Techniques",
		course: "BCA_OL",
		isbn: "978-81-237-0400-1",
		isUsed: true,
		condition: "Fair",
		price: 280,
		stockZones: ["Z-10", "HQ"],
	},
	{
		id: "book-12",
		code: "MCS-013",
		title: "Discrete Mathematics",
		course: "MCA_NEW",
		isbn: "978-81-237-0130-5",
		isUsed: false,
		condition: "New",
		price: 480,
		stockZones: ["Z-05", "Z-12"],
	},
	{
		id: "book-13",
		code: "MCS-042",
		title: "Linux Administration",
		course: "MCA_OL",
		isbn: "978-81-237-0420-4",
		isUsed: true,
		condition: "Like New",
		price: 510,
		stockZones: ["Z-01", "RC-03"],
	},
];

export const centralDashboardEntries: DashboardEntry[] = [
	{
		name: "Amit Sharma",
		address: "Flat 402, Dwarka Sector 10, New Delhi 110075",
		serial: 1,
		enrollment: "2201234567",
		date: "2025-11-27",
		requestedFrom: "Zone Z-12",
		orderType: "mixed",
		txnId: "TXN-91AB2",
		paymentMode: "UPI",
		mobile: "+91-9876543210",
		status: "Pending",
		books: ["BCS-011 Computer Basics", "MCS-034 Data Structures"],
	},
	{
		name: "Priya Verma",
		address: "DDA Flats, Janakpuri, New Delhi 110058",
		serial: 2,
		enrollment: "2202234567",
		date: "2025-11-26",
		requestedFrom: "RC-02",
		orderType: "new",
		txnId: "TXN-11CD9",
		paymentMode: "Card",
		mobile: "+91-9988776655",
		status: "Approved",
		books: ["BCSL-056 Network Lab Manual"],
	},
	{
		name: "Rahul Singh",
		address: "C-56, Connaught Place, New Delhi 110001",
		serial: 3,
		enrollment: "2203234567",
		date: "2025-11-25",
		requestedFrom: "HQ",
		orderType: "old",
		txnId: "TXN-44EF1",
		paymentMode: "Cash",
		mobile: "+91-9090909090",
		status: "Completed",
		books: ["MCS-021 Operating Systems", "MCS-013 Discrete Mathematics"],
	},
	{
		name: "Neha Kapoor",
		address: "Pocket B, Rohini Sector 3, Delhi 110085",
		serial: 4,
		enrollment: "2204234567",
		date: "2025-11-24",
		requestedFrom: "Zone Z-05",
		orderType: "new",
		txnId: "TXN-99GH8",
		paymentMode: "UPI",
		mobile: "+91-9123456780",
		status: "Cancelled",
		books: ["BCS-040 Statistical Techniques"],
	},
];

export const bulkRequests: BulkRequest[] = [
	{
		id: "req-1",
		requestor: "RC-01",
		role: "RC_ADMIN",
		book: "BCS-011",
		count: 120,
		note: "Exam cycle Jan batch",
		payment: "PO",
		status: "Requested",
		date: "2025-11-20",
	},
	{
		id: "req-2",
		requestor: "HQ",
		role: "ADMIN",
		book: "MCS-034",
		count: 300,
		note: "Reprint for Delhi + Jaipur",
		payment: "NEFT",
		status: "Queued for Print",
		date: "2025-11-19",
	},
	{
		id: "req-3",
		requestor: "Distributor D-09",
		role: "DISTRIBUTOR",
		book: "BCSL-056",
		count: 45,
		note: "South West Delhi hub replenishment",
		payment: "UPI",
		status: "In Transit",
		date: "2025-11-18",
	},
];

export const zoneInfos: ZoneInfo[] = [
	{
		id: "zone-1",
		name: "Zone Z-12 (South Delhi Hub)",
		rc: "RC-02",
		zone: "Z-12",
		avgRating: 4.6,
		booksSentThisMonth: 420,
		booksSentLastMonth: 390,
		stock: 860,
		location: "Saket, Delhi",
	},
	{
		id: "zone-2",
		name: "Zone Z-05 (Central Delhi)",
		rc: "RC-01",
		zone: "Z-05",
		avgRating: 4.3,
		booksSentThisMonth: 380,
		booksSentLastMonth: 350,
		stock: 720,
		location: "Connaught Place, Delhi",
	},
	{
		id: "zone-3",
		name: "Headquarters (Maidan Garhi)",
		rc: "HQ",
		zone: "HQ",
		avgRating: 4.8,
		booksSentThisMonth: 980,
		booksSentLastMonth: 920,
		stock: 2400,
		location: "Maidan Garhi, Delhi",
	},
];

export const analyticsSnapshot = {
	dispatches: {
		hq: 980,
		rc: 1150,
		zones: 1750,
	},
	stock: {
		hq: 2400,
		rc: 1680,
		zones: 3420,
	},
	totals: {
		students: 14250,
		zones: 50,
		hubs: 100,
		distributors: 25,
	},
	sales: {
		valueInCrores: 1.8,
		lastMonth: 1.2,
	},
	pastAnalytics: [
		{ label: "On-time deliveries", value: "92%" },
		{ label: "Avg. delivery time", value: "2.4 days" },
		{ label: "Pickup preference", value: "38%" },
	],
};
