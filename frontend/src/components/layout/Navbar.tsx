import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { logoutUser } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store/store";

const Navbar: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.auth.user);

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/login");
	};

	// Role-based quick links; keep minimal for now
	const roleLinks: Record<string, { to: string; label: string }[]> = {
		ADMIN: [
			{ to: "/admin", label: "Dashboard" },
			{ to: "/register", label: "Invite Admin" },
		],
		STUDENT: [
			{ to: "/student", label: "Dashboard" },
			{ to: "/register", label: "Profile" },
		],
	};

	const navLinks = user ? roleLinks[user.role] || [] : [];

	return (
		<nav className="fixed top-0 left-0 w-full z-50 bg-linear-to-r from-slate-900/85 via-slate-800/85 to-slate-900/85 backdrop-blur-md border-b border-amber-200/15 shadow-2xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link to="/" className="text-xl font-semibold text-amber-200 tracking-tight hover:text-amber-100 transition">
						BookTrackr
					</Link>

					<div className="hidden md:flex items-center space-x-6">
						{user &&
							navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="text-amber-50/80 hover:text-amber-200 transition"
								>
									{link.label}
								</Link>
							))}

						{user ? (
							<button
								onClick={handleLogout}
								className="ml-4 px-4 py-2 rounded-md border border-amber-200/30 text-amber-100 bg-slate-800/70 hover:bg-slate-700/80 hover:text-white transition"
							>
								Logout
							</button>
						) : (
							<>
								<Link to="/login" className="text-amber-50/80 hover:text-amber-200 transition">
									Login
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 rounded-md bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
								>
									Register
								</Link>
							</>
						)}
					</div>

					<div className="md:hidden">
						<button onClick={() => setMenuOpen(!menuOpen)} className="text-amber-100 focus:outline-none">
							{menuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{menuOpen && (
				<div className="md:hidden bg-slate-900/90 backdrop-blur-md shadow-xl border-t border-amber-200/15">
					<div className="px-4 py-3 space-y-3">
						{user &&
							navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									onClick={() => setMenuOpen(false)}
									className="block text-amber-50/80 hover:text-amber-200 transition"
								>
									{link.label}
								</Link>
							))}
						{user ? (
							<button
								onClick={() => {
									setMenuOpen(false);
									handleLogout();
								}}
								className="w-full text-left text-amber-50/80 hover:text-amber-200 font-medium mt-2"
							>
								Logout
							</button>
						) : (
							<>
								<Link
									to="/login"
									onClick={() => setMenuOpen(false)}
									className="block text-amber-50/80 hover:text-amber-200 transition"
								>
									Login
								</Link>
								<Link
									to="/register"
									onClick={() => setMenuOpen(false)}
									className="block text-amber-300 font-semibold"
								>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
