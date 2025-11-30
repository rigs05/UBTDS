import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { prisma } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import router from "./routes/index.js";

const ALLOWED_ORIGINS = process.env.FRONTEND_URLS as String;
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin)
			return callback(null, true);
		return callback(new Error(`Origin ${origin} not allowed by CORS`));
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

(async () => {
	// Connect the DB
	await prisma
		.$connect()
		.then(() => console.log("Database connected successfully."))
		.catch((err) => console.error("Unable to connect to Prisma client: ", err));

		app.use(cookieParser());
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
