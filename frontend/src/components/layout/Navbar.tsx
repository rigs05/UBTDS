import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.auth.user);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	// ----- Dynamic links based on role -----
	const commonLinks = [
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/orders", label: "Orders" },
	];

	const roleLinks: Record<string, { to: string; label: string }[]> = {
		ADMIN: [
			...commonLinks,
			{ to: "/books", label: "Books" },
			{ to: "/rcs", label: "Regional Centers" },
			{ to: "/zones", label: "Zones" },
			{ to: "/reports", label: "Reports" },
		],
		RC_ADMIN: [
			...commonLinks,
			{ to: "/zones", label: "Zones" },
			{ to: "/distributors", label: "Distributors" },
		],
		DISTRIBUTOR: [
			...commonLinks,
			{ to: "/deliveries", label: "Deliveries" },
			{ to: "/routes", label: "Routes" },
		],
		STUDENT: [
			...commonLinks,
			{ to: "/books", label: "Books" },
			{ to: "/track", label: "Track Orders" },
		],
	};

	const navLinks = user ? roleLinks[user.role] || [] : [];

	return (
		<nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo / App Name */}
					<Link
						to="/"
						className="text-xl font-bold text-indigo-700 hover:text-indigo-800"
					>
						BookTrackr
					</Link>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center space-x-6">
						{user &&
							navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="text-gray-700 hover:text-indigo-600 transition"
								>
									{link.label}
								</Link>
							))}

						{user ? (
							<button
								onClick={handleLogout}
								className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
							>
								Logout
							</button>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-700 hover:text-indigo-600 transition"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
								>
									Register
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-gray-700 focus:outline-none"
						>
							{menuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Dropdown */}
			{menuOpen && (
				<div className="md:hidden bg-white shadow-lg border-t border-gray-100">
					<div className="px-4 py-3 space-y-3">
						{user &&
							navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									onClick={() => setMenuOpen(false)}
									className="block text-gray-700 hover:text-indigo-600"
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
								className="w-full text-left text-red-600 hover:text-red-700 font-medium mt-2"
							>
								Logout
							</button>
						) : (
							<>
								<Link
									to="/login"
									onClick={() => setMenuOpen(false)}
									className="block text-gray-700 hover:text-indigo-600"
								>
									Login
								</Link>
								<Link
									to="/register"
									onClick={() => setMenuOpen(false)}
									className="block text-indigo-600 font-medium"
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
