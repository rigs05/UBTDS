export interface JwtPayload {
	id: string;
	email: string;
	role: string;
}

export type Role = "ADMIN" | "RC_ADMIN" | "DISTRIBUTOR" | "STUDENT";

export interface SafeUser {
	id: string;
	email: string;
	role: Role;
	firstName?: string | null;
	lastName?: string | null;
}
