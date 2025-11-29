// Layout wrapper to fetch session and render global chrome.
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
		<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black">
			<Navbar />
			<div className="pt-20 px-4 sm:px-6 pb-10 max-w-7xl mx-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;
