import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import AdminDashboard from "../components/pages/admin/AdminDashboard";
import CentralDashboard from "../components/pages/admin/CentralDashboard";
import AnalyticsPage from "../components/pages/admin/AnalyticsPage";
import ZoneHubDetails from "../components/pages/admin/ZoneHubDetails";
import DistributorDashboard from "../components/pages/distributor/DistributorDashboard";
import StudentDashboard from "../components/pages/student/StudentDashboard";
import BookCatalog from "../components/pages/catalog/BookCatalog";
import FeedbackPage from "../components/pages/feedback/FeedbackPage";
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
						<ProtectedRoute roles={["ADMIN", "RC_ADMIN"]}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/central"
					element={
						<ProtectedRoute roles={["ADMIN", "RC_ADMIN"]}>
							<CentralDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/analytics"
					element={
						<ProtectedRoute roles={["ADMIN", "RC_ADMIN"]}>
							<AnalyticsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/zones"
					element={
						<ProtectedRoute roles={["ADMIN", "RC_ADMIN", "DISTRIBUTOR", "STUDENT"]}>
							<ZoneHubDetails />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/distributor"
					element={
						<ProtectedRoute roles={["DISTRIBUTOR"]}>
							<DistributorDashboard />
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
				<Route
					path="/catalog"
					element={
						<ProtectedRoute roles={["STUDENT", "ADMIN", "RC_ADMIN", "DISTRIBUTOR"]}>
							<BookCatalog />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/feedback"
					element={
						<ProtectedRoute roles={["STUDENT", "ADMIN", "RC_ADMIN", "DISTRIBUTOR"]}>
							<FeedbackPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<Navigate to="/login" replace />} />
			</Route>
		</Routes>
	);
}
