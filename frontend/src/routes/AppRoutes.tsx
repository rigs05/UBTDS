import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import AdminDashboard from "../components/pages/admin/AdminDashboard";
import StudentDashboard from "../components/pages/student/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/admin"
					element={
						<ProtectedRoute roles={["ADMIN"]}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/student"
					element={
						<ProtectedRoute roles={["STUDENT"]}>
							<StudentDashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<Navigate to="/login" replace />} />
			</Route>
		</Routes>
	);
}
