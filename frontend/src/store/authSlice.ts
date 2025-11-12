import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Adjust this base URL for your backend API (Vite will proxy if configured)
axios.defaults.withCredentials = true; // important for cookies (JWT)
axios.defaults.baseURL =
	import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ----- Types -----
export type Role = "ADMIN" | "RC_ADMIN" | "DISTRIBUTOR" | "STUDENT";

export interface User {
	id: string;
	email: string;
	role: Role;
	firstName?: string;
	lastName?: string;
}

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

// ----- Initial State -----
const initialState: AuthState = {
	user: null,
	loading: false,
	error: null,
};

// ----- Async Thunks -----
export const registerUser = createAsyncThunk(
	"auth/register",
	async (data: any, { rejectWithValue }) => {
		try {
			const res = await axios.post("/auth/register", data);
			return res.data.user;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Registration failed"
			);
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (data: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const res = await axios.post("/auth/login", data);
			return res.data.user;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Login failed");
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
	await axios.post("/auth/logout");
	return null;
});

// ----- Slice -----
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<User | null>) {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// REGISTER
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(registerUser.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
			})
			// LOGIN
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
			})
			// LOGOUT
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
			});
	},
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
