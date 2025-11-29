import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error("DATABASE_URL not set. Cannot seed admin.");
	process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const email = "sunny.admin@example.com";
const password = "sunny123";
const enrollmentNo = "1234567890";
const address = "New Delhi";
const firstName = "Sunny";
const role = "ADMIN";

const run = async () => {
	const hashed = await bcrypt.hash(password, 10);
	await prisma.user.upsert({
		where: { email },
		update: { password: hashed, firstName, enrollmentNo, address, role },
		create: { email, password: hashed, firstName, enrollmentNo, address, role },
	});
	console.log("Admin user ensured:", email);
	await prisma.$disconnect();
};

run().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
