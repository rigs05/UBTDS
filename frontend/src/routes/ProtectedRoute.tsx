import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Role } from "../utils/types";

interface Props {
	children: React.ReactElement;
	roles?: Role[];
}

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
	const { user, loading, initialized } = useSelector((state: RootState) => state.auth);
	const location = useLocation();

	if (loading || !initialized) {
		return <p className="text-amber-100 text-sm">Loading...</p>;
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
};

export default ProtectedRoute;
