import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "./Navbar";
import { fetchSession } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";

const AppLayout: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchSession());
	}, [dispatch]);

	return (
		<div>
			<Navbar />
			<div className="pt-16">
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;
