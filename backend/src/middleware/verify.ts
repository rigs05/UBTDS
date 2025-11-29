import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../utils/interfaces.js";
import { COOKIE_NAME } from "../utils/constants.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
	// Pull token from signed-in user's cookie or Authorization header
	const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace("Bearer ", "");

	if (!token) {
		res.status(401).json({ message: "Access denied. No token provided." });
		return;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
		(req as any).user = decoded;
		next();
	} catch {
		res.status(403).json({ message: "Invalid or expired token." });
	}
};
