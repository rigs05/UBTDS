import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, BookCondition, HubType, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` }) });

const zonesData = [
	{ code: "Z-01", name: "Central Hub", rc: "RC-01", address: "Block B, Connaught Place, New Delhi 110001", distanceKm: 4, stock: 320, note: "Major zone", phone: "+91-98100-00001" },
	{ code: "Z-02", name: "Karol Bagh Hub", rc: "RC-01", address: "DB Gupta Road, Karol Bagh, New Delhi 110005", distanceKm: 6, stock: 280, note: "RC manages deliveries", phone: "+91-98100-00002" },
	{ code: "Z-03", name: "Model Town Hub", rc: "RC-01", address: "Ring Road, Model Town 2, Delhi 110009", distanceKm: 8, stock: 250, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00003" },
	{ code: "Z-04", name: "Rohini Sector 3", rc: "RC-03", address: "Pocket A, Rohini Sector 3, Delhi 110085", distanceKm: 12, stock: 260, note: "Self pickup only", phone: "+91-98100-00004" },
	{ code: "Z-05", name: "Pitampura Hub", rc: "RC-03", address: "NSP, Pitampura, Delhi 110034", distanceKm: 10, stock: 270, note: "RC manages deliveries", phone: "+91-98100-00005" },
	{ code: "Z-06", name: "Janakpuri Hub", rc: "RC-02", address: "C-2 Block, Janakpuri, New Delhi 110058", distanceKm: 7, stock: 300, note: "Major zone", phone: "+91-98100-00006" },
	{ code: "Z-07", name: "Dwarka Sector 7", rc: "RC-02", address: "Pocket 2, Dwarka Sector 7, New Delhi 110075", distanceKm: 9, stock: 310, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00007" },
	{ code: "Z-08", name: "Dwarka Sector 10", rc: "RC-02", address: "Metro View, Dwarka Sector 10, New Delhi 110075", distanceKm: 11, stock: 295, note: "Self pickup only", phone: "+91-98100-00008" },
	{ code: "Z-09", name: "Vikas Puri Hub", rc: "RC-02", address: "PVR Road, Vikas Puri, New Delhi 110018", distanceKm: 6, stock: 285, note: "RC manages deliveries", phone: "+91-98100-00009" },
	{ code: "Z-10", name: "Saket Hub", rc: "RC-02", address: "Mandir Marg, Saket, New Delhi 110017", distanceKm: 14, stock: 275, note: "Major zone", phone: "+91-98100-00010" },
	{ code: "Z-11", name: "Vasant Kunj Hub", rc: "RC-02", address: "Pocket B, Vasant Kunj, New Delhi 110070", distanceKm: 15, stock: 260, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00011" },
	{ code: "Z-12", name: "South Delhi Hub", rc: "RC-02", address: "IGNOU Road, Maidan Garhi, New Delhi 110068", distanceKm: 5, stock: 340, note: "Major zone", phone: "+91-98100-00012" },
	{ code: "Z-13", name: "Okhla Phase 1", rc: "RC-01", address: "Industrial Area, Okhla Phase 1, New Delhi 110020", distanceKm: 9, stock: 245, note: "Self pickup only", phone: "+91-98100-00013" },
	{ code: "Z-14", name: "Lajpat Nagar Hub", rc: "RC-01", address: "Ring Road, Lajpat Nagar 4, New Delhi 110024", distanceKm: 7, stock: 255, note: "RC manages deliveries", phone: "+91-98100-00014" },
	{ code: "Z-15", name: "Kalkaji Hub", rc: "RC-01", address: "Main Road, Kalkaji, New Delhi 110019", distanceKm: 8, stock: 240, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00015" },
	{ code: "Z-16", name: "Mayur Vihar Phase 1", rc: "RC-01", address: "Pocket A, Mayur Vihar Phase 1, Delhi 110091", distanceKm: 13, stock: 235, note: "Self pickup only", phone: "+91-98100-00016" },
	{ code: "Z-17", name: "Preet Vihar Hub", rc: "RC-01", address: "Vikas Marg, Preet Vihar, Delhi 110092", distanceKm: 15, stock: 225, note: "RC manages deliveries", phone: "+91-98100-00017" },
	{ code: "Z-18", name: "Noida Border Hub", rc: "RC-01", address: "Chilla Village, Delhi 110096", distanceKm: 18, stock: 215, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00018" },
	{ code: "Z-19", name: "Shahdara Hub", rc: "RC-03", address: "GT Road, Shahdara, Delhi 110032", distanceKm: 16, stock: 230, note: "Self pickup only", phone: "+91-98100-00019" },
	{ code: "Z-20", name: "Yamuna Vihar Hub", rc: "RC-03", address: "C Block, Yamuna Vihar, Delhi 110053", distanceKm: 17, stock: 220, note: "RC manages deliveries", phone: "+91-98100-00020" },
	{ code: "Z-21", name: "Ghaziabad Border", rc: "RC-03", address: "Mohan Nagar, Ghaziabad Border, Ghaziabad 201007", distanceKm: 20, stock: 210, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00021" },
	{ code: "Z-22", name: "Najafgarh Hub", rc: "RC-02", address: "Old Roshanpura, Najafgarh, New Delhi 110043", distanceKm: 19, stock: 205, note: "Self pickup only", phone: "+91-98100-00022" },
	{ code: "Z-23", name: "Uttam Nagar Hub", rc: "RC-02", address: "Matiala Road, Uttam Nagar, New Delhi 110059", distanceKm: 8, stock: 245, note: "RC manages deliveries", phone: "+91-98100-00023" },
	{ code: "Z-24", name: "Palam Hub", rc: "RC-02", address: "Palam Village, South West Delhi 110010", distanceKm: 10, stock: 235, note: "Deliveries handled by IndiaPost", phone: "+91-98100-00024" },
	{ code: "Z-25", name: "Mehrauli Hub", rc: "RC-02", address: "Ward 1, Mehrauli, New Delhi 110030", distanceKm: 6, stock: 255, note: "Major zone", phone: "+91-98100-00025" },
];

const booksData = [
	{ title: "Computer Basics", isbn: "978-81-237-0110-1", condition: BookCondition.NEW, price: 420, course: "BCA" },
	{ title: "Data Structures", isbn: "978-81-237-0340-2", condition: BookCondition.NEW, price: 280, course: "MCA_NEW" },
	{ title: "Network Lab Manual", isbn: "978-81-237-0560-5", condition: BookCondition.NEW, price: 360, course: "BCA" },
	{ title: "Problem Solving & Programming", isbn: "978-81-237-0111-2", condition: BookCondition.NEW, price: 300, course: "MCA_OL" },
	{ title: "Linux Lab", isbn: "978-81-237-0450-0", condition: BookCondition.NEW, price: 250, course: "BCA" },
	{ title: "Mathematics", isbn: "978-81-237-0120-0", condition: BookCondition.NEW, price: 390, course: "BCA" },
	{ title: "Database Management Systems", isbn: "978-81-237-0310-9", condition: BookCondition.NEW, price: 450, course: "BCA_OL" },
	{ title: "Operating Systems", isbn: "978-81-237-0210-3", condition: BookCondition.NEW, price: 520, course: "MCA_NEW" },
	{ title: "Java Lab", isbn: "978-81-237-0160-1", condition: BookCondition.NEW, price: 310, course: "MCA_OL" },
	{ title: "Data Structures Lab", isbn: "978-81-237-0330-0", condition: BookCondition.NEW, price: 330, course: "BCA" },
	{ title: "Statistical Techniques", isbn: "978-81-237-0400-1", condition: BookCondition.NEW, price: 280, course: "BCA_OL" },
	{ title: "Discrete Mathematics", isbn: "978-81-237-0130-5", condition: BookCondition.NEW, price: 480, course: "MCA_NEW" },
	{ title: "Linux Administration", isbn: "978-81-237-0420-4", condition: BookCondition.NEW, price: 510, course: "MCA_OL" },
];

async function main() {
	// Clear data
	await prisma.feedback.deleteMany({});
	await prisma.pickupRequest.deleteMany({});
	await prisma.bulkRequest.deleteMany({});
	await prisma.orderItem.deleteMany({});
	await prisma.order.deleteMany({});
	await prisma.stock.deleteMany({});
	await prisma.book.deleteMany({});
	await prisma.hub.deleteMany({});
	await prisma.distributor.deleteMany({});
	await prisma.zone.deleteMany({});
	await prisma.regionalCenter.deleteMany({});
	await prisma.course.deleteMany({});
	await prisma.user.deleteMany({});

	// RCs
	const rc1 = await prisma.regionalCenter.create({ data: { name: "Regional Center 01", code: "RC-01", address: "Dwarka, New Delhi", state: "Delhi" } });
	const rc2 = await prisma.regionalCenter.create({ data: { name: "Regional Center 02", code: "RC-02", address: "Janakpuri, New Delhi", state: "Delhi" } });
	const rc3 = await prisma.regionalCenter.create({ data: { name: "Regional Center 03", code: "RC-03", address: "Shahdara, Delhi", state: "Delhi" } });
	const rcMap: Record<string, string> = { "RC-01": rc1.id, "RC-02": rc2.id, "RC-03": rc3.id };

	// Zones
	const zonePayload = zonesData
		.map((z) => ({
			name: z.name,
			code: z.code,
			state: "Delhi",
			address: z.address,
			phone: z.phone,
			distanceKm: z.distanceKm,
			rating: 4.0 + Math.random() * 0.8,
			note: z.note,
			rcId: rcMap[z.rc],
		}))
		.filter((z) => !!z.rcId) as {
		name: string;
		code: string;
		state: string;
		address: string;
		phone: string;
		distanceKm: number;
		rating: number;
		note: string;
		rcId: string;
	}[];
	await prisma.zone.createMany({ data: zonePayload });
	const zones = await prisma.zone.findMany();
	const zoneByCode: Record<string, string> = Object.fromEntries(zones.map((z) => [z.code as string, z.id]));

	// Users (hashed)
	const adminHash = await bcrypt.hash("Admin@123", 10);
	const distributorHash = await bcrypt.hash("Distributor@123", 10);
	const studentHash = await bcrypt.hash("Student@123", 10);
	const sunnyHash = await bcrypt.hash("sunny123", 10);
	const dubeyHash = await bcrypt.hash("dubey123", 10);

	await prisma.user.create({ data: { firstName: "System", lastName: "Admin", email: "admin@ubtds.test", password: adminHash, role: Role.ADMIN } });
	await prisma.user.create({ data: { firstName: "Sunny", lastName: "Admin", email: "sunny.admin@example.com", password: sunnyHash, role: Role.ADMIN } });
	const rcAdmin = await prisma.user.create({
		data: { firstName: "RC", lastName: "Lead", email: "rcadmin@ubtds.test", password: adminHash, role: Role.RC_ADMIN, rcId: rc2.id },
	});
	await prisma.user.create({
		data: {
			firstName: "Distributor",
			lastName: "User",
			email: "distributor@ubtds.test",
			password: distributorHash,
			role: Role.DISTRIBUTOR,
			zoneId: zoneByCode["Z-12"],
		},
	});
	await prisma.user.create({
		data: {
			firstName: "Dubey",
			lastName: "Distributor",
			email: "dubey.distributor@test.com",
			password: dubeyHash,
			role: Role.DISTRIBUTOR,
			zoneId: zoneByCode["Z-05"],
		},
	});
	const student = await prisma.user.create({
		data: {
			firstName: "Amit",
			lastName: "Sharma",
			email: "student@ubtds.test",
			password: studentHash,
			role: Role.STUDENT,
			enrollmentNo: "2201234567",
			phone: "+91-9876543210",
			address: "Dwarka Sector 10, New Delhi",
			zoneId: zoneByCode["Z-12"],
		},
	});

	// Courses
	await prisma.course.createMany({
		data: [
			{ title: "BCA", description: "Bachelor of Computer Applications" },
			{ title: "BCA_OL", description: "BCA Online" },
			{ title: "MCA_NEW", description: "Master of Computer Applications" },
			{ title: "MCA_OL", description: "MCA Online" },
		],
	});
	const courseMap = await prisma.course.findMany();
	const courseIdByTitle = Object.fromEntries(courseMap.map((c) => [c.title, c.id]));
	const fallbackCourseId = courseMap[0]?.id;

	// Books
	await prisma.book.createMany({
		data: booksData.map((b) => ({
			title: b.title,
			isbn: b.isbn,
			condition: b.condition,
			price: b.price,
			courseId: courseIdByTitle[b.course] ?? fallbackCourseId ?? null,
		})),
	});
	const bookList = await prisma.book.findMany();
	const bookIdByIsbn: Record<string, string> = Object.fromEntries(bookList.map((b) => [b.isbn as string, b.id]));
	const safeBookId = (isbn: string) => (bookIdByIsbn[isbn] as string) || bookList[0]?.id || "";

	// Stock samples
	await prisma.stock.createMany({
		data: [
			{ bookId: safeBookId("978-81-237-0110-1"), zoneId: zoneByCode["Z-12"], quantity: 150 },
			{ bookId: safeBookId("978-81-237-0340-2"), zoneId: zoneByCode["Z-12"], quantity: 90 },
			{ bookId: safeBookId("978-81-237-0110-1"), zoneId: zoneByCode["Z-05"], quantity: 120 },
			{ bookId: safeBookId("978-81-237-0560-5"), zoneId: zoneByCode["Z-06"] || zoneByCode["Z-12"], quantity: 80 },
		].filter((s) => s.bookId && s.zoneId),
	});

	// Hub + Distributor
	await prisma.hub.create({
		data: {
			name: "Hub H-44 (Janakpuri)",
			address: "Janakpuri, Delhi",
			type: HubType.MAJOR,
			zoneId: zoneByCode["Z-12"] || zones[0].id,
		},
	});
	await prisma.distributor.create({
		data: {
			name: "Distributor D-09",
			phone: "9999999999",
			zoneId: zoneByCode["Z-12"] || zones[0].id,
		},
	});

	// Feedback
	await prisma.feedback.createMany({
		data: [
			{
				userId: student.id,
				message: "Package delayed by 2 days, please improve courier coordination.",
				feedbackType: "Delivery",
				contact: student.phone,
				enrollment: student.enrollmentNo,
				senderRole: Role.STUDENT,
			},
			{
				userId: rcAdmin.id,
				message: "Need faster replenishment for BCS-011, stock-outs frequent.",
				feedbackType: "Stock",
				contact: "9999999999",
				senderRole: Role.RC_ADMIN,
			},
		],
	});

	// Pickup
	await prisma.pickupRequest.create({
		data: {
			enrollment: student.enrollmentNo || "2201234567",
			location: "Zone Z-12 (South Delhi Hub)",
			status: "Pending",
		},
	});

	// Bulk requests
	await prisma.bulkRequest.createMany({
		data: [
			{
				requestor: "RC-01",
				role: Role.RC_ADMIN,
				bookCode: "BCS-011",
				count: 120,
				note: "Exam cycle Jan batch",
				payment: "PO" as any,
				status: "Requested",
			},
			{
				requestor: "HQ",
				role: Role.ADMIN,
				bookCode: "MCS-034",
				count: 300,
				note: "Reprint for Delhi + Jaipur",
				payment: "NEFT" as any,
				status: "Queued for Print",
			},
			{
				requestor: "Distributor D-09",
				role: Role.DISTRIBUTOR,
				bookCode: "BCSL-056",
				count: 45,
				note: "South West Delhi hub replenishment",
				payment: "UPI" as any,
				status: "In Transit",
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
