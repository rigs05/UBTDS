import type { NextFunction, Request, Response } from "express";
import type { JwtPayload, Role } from "../utils/interfaces.js";

export const requireRole = (roles: Role[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const user = (req as any).user as JwtPayload | undefined;

		if (!user || !roles.includes(user.role as Role)) {
			res.status(403).json({ message: "Insufficient permissions." });
			return;
		}

		next();
	};
};
