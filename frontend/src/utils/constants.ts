export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AUTH_ENDPOINTS = {
	login: "/auth/login",
	registerStudent: "/auth/register",
	registerAdmin: "/auth/register/admin",
	registerDistributor: "/auth/register/distributor",
	logout: "/auth/logout",
	session: "/auth/me",
};
