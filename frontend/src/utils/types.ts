export type Role = "ADMIN" | "RC_ADMIN" | "DISTRIBUTOR" | "STUDENT";

export interface User {
	id: string;
	email: string;
	role: Role;
	firstName?: string | null;
	lastName?: string | null;
}
