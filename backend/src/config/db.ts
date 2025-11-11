// import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const connectDB = async (): Promise<void> => {
//   try {
//     await prisma.$connect();
//     console.log('Connected to PostgreSQL database successfully.');
//   } catch (err) {
//     console.error('Database connection failed:', err);
//     process.exit(1);
//   }
// };

export default prisma;