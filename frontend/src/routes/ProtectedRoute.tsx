import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Role } from "../utils/types";

interface Props {
	children: React.ReactElement;
	roles?: Role[];
}

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
	const user = useSelector((state: RootState) => state.auth.user);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
