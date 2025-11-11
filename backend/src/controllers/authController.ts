import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRES = "7d";

// ---------- REGISTER ----------
export const registerController = async (req: Request, res: Response) => {
	let role: "ADMIN" | "STUDENT" | undefined;
	try {
		const { email, password, firstName, lastName, phone, address, isAdmin } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required." });
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists." });
		}

		if (isAdmin === true) {
			role = "ADMIN";
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				phone,
				address,
				role: role || "STUDENT",
			},
		});

		// Generate JWT
		const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
			expiresIn: TOKEN_EXPIRES,
		});

		// Send token in httpOnly cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(201).json({ message: "Registration successful", user: { id: newUser.id, email: newUser.email } });
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

		// Check user existence
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Verify password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials." });
		}

		// Generate JWT
		const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
			expiresIn: TOKEN_EXPIRES,
		});

		// Send token in httpOnly cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, role: user.role } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during login." });
	}
};

// ---------- LOGOUT ----------
export const logoutController = async (req: Request, res: Response) => {
	try {
		res.clearCookie("token", {
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