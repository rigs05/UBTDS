import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { COOKIE_NAME, TOKEN_EXPIRES } from "../utils/constants.js";
import type { Role, SafeUser } from "../utils/interfaces.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

const buildSafeUser = (user: any): SafeUser => ({
	id: user.id,
	email: user.email,
	role: user.role,
	firstName: user.firstName,
	lastName: user.lastName,
});

const setAuthCookie = (res: Response, token: string): void => {
	res.cookie(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

// ---------- REGISTER (Student self-serve, Admin only by existing admin) ----------
export const registerController = async (req: Request, res: Response) => {
	try {
		const {
			email,
			password,
			firstName,
			lastName,
			phone,
			address,
			enrollmentNo,
			role,
		}: Partial<any> & { role?: Role } = req.body;

		if (!email || !password || !firstName) {
			return res.status(400).json({ message: "Email, password, and first name are required." });
		}

		const requestedRole: Role = role || "STUDENT";

		// If trying to create an admin, ensure the requester is an authenticated admin
		if (requestedRole === "ADMIN") {
			const requester = (req as any).user;
			if (!requester || requester.role !== "ADMIN") {
				return res.status(403).json({ message: "Admin registration requires an authenticated admin." });
			}
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const enrollmentValue = enrollmentNo?.toString().trim() || undefined;

		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				phone,
				address,
				enrollmentNo: requestedRole === "STUDENT" ? enrollmentValue : undefined,
				role: requestedRole,
			},
		});

		const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
			expiresIn: TOKEN_EXPIRES,
		});

		setAuthCookie(res, token);

		res.status(201).json({ message: "Registration successful", user: buildSafeUser(newUser) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during registration." });
	}
};

// ---------- LOGIN ----------
export const loginController = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required." });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials." });
		}

		const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
			expiresIn: TOKEN_EXPIRES,
		});

		setAuthCookie(res, token);

		res.status(200).json({ message: "Login successful", user: buildSafeUser(user) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during login." });
	}
};

// ---------- LOGOUT ----------
export const logoutController = async (_req: Request, res: Response) => {
	try {
		res.clearCookie(COOKIE_NAME, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during logout." });
	}
};

// ---------- SESSION ----------
export const sessionController = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		if (!user?.id) {
			return res.status(401).json({ message: "Not authenticated." });
		}
		const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
		if (!dbUser) {
			return res.status(401).json({ message: "Session invalid." });
		}
		res.status(200).json({ user: buildSafeUser(dbUser) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unable to fetch session." });
	}
};
