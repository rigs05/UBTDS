import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const run = async () => {
	const u = await prisma.user.findUnique({ where: { email: "sunny.admin@example.com" } });
	if (!u) {
		console.log("Not found");
	} else {
		console.log("Found user", { email: u.email, role: u.role, enrollmentNo: u.enrollmentNo, address: u.address });
	}
};

run().catch(console.error).finally(() => prisma.$disconnect());
