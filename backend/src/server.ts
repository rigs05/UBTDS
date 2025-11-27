import express, { type NextFunction, type Request, type Response } from 'express';
import router from './routes/index.js';
import authRouter from './routes/authRoutes.js';
import cors, { type CorsOptions } from 'cors';
import { prisma } from './config/db.js';
// import prisma from './config/db.js';
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

(async () => {
	// Connect the DB
	await prisma.$connect()
	.then(() => console.log("Database connected successfully.") )
	.catch(err => console.error("Unable to connect to Prisma client: ", err));
	
	
	app.use(cors(corsOptions));

	app.use(express.json());
	app.use("/auth", authRouter);
	app.use("/api", router);

	// Global Fallback Error Handler
	app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
		res.status(500).json({ message: "Something's down with our server." });
	});

	// Start the Server on the specified PORT
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
})();