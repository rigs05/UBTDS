import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_ENDPOINTS, API_BASE_URL } from "../utils/constants";
import type { User } from "../utils/types";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
	initialized: boolean;
}

const initialState: AuthState = {
	user: null,
	loading: false,
	error: null,
	initialized: false,
};

export const fetchSession = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
	try {
		const res = await axios.get(AUTH_ENDPOINTS.session);
		return res.data.user as User;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || "Session fetch failed");
	}
});

export const registerUser = createAsyncThunk(
	"auth/register",
	async (data: any, { rejectWithValue }) => {
		try {
			const isAdminish = data.role === "ADMIN" || data.role === "DISTRIBUTOR";
			const endpoint = isAdminish ? AUTH_ENDPOINTS.registerAdmin : AUTH_ENDPOINTS.registerStudent;
			const payload = { ...data, role: data.role };
			const res = await axios.post(endpoint, payload);
			return res.data.user as User;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Registration failed");
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (data: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const res = await axios.post(AUTH_ENDPOINTS.login, data);
			return res.data.user as User;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Login failed");
		}
	}
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
	await axios.post(AUTH_ENDPOINTS.logout);
	return null;
});

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
			.addCase(fetchSession.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSession.fulfilled, (state, action: PayloadAction<User>) => {
				state.loading = false;
				state.user = action.payload;
				state.initialized = true;
			})
			.addCase(fetchSession.rejected, (state) => {
				state.loading = false;
				state.user = null;
				state.initialized = true;
			})
			// REGISTER
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.loading = false;
				state.user = action.payload;
				state.initialized = true;
			})
			.addCase(registerUser.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
				state.initialized = true;
			})
			// LOGIN
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.loading = false;
				state.user = action.payload;
				state.initialized = true;
			})
			.addCase(loginUser.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload;
				state.initialized = true;
			})
			// LOGOUT
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.initialized = true;
			});
	},
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
