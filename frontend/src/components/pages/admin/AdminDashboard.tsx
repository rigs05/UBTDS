// HQ/RC admin dashboard summary entry point.
import React from "react";
import { BarChart3, CheckSquare, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const AdminDashboard: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user);
	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center gap-3">
				<div className="p-3 rounded-xl bg-amber-400/15 border border-amber-200/30">
					<ClipboardList className="w-6 h-6 text-amber-200" />
				</div>
				<div>
					<p className="text-xs text-amber-100/70">Headquarters + RC control</p>
					<h1 className="text-2xl font-semibold text-amber-100">Admin console</h1>
					<p className="text-sm text-amber-100/70">Jump into approvals, analytics, and zone intelligence.</p>
					{user && (
						<p className="text-xs text-amber-100/70 mt-1">
							Logged in as {user.firstName} {user.lastName || ""} • {user.email}
						</p>
					)}
				</div>
			</header>

			<section className="grid md:grid-cols-4 gap-3">
				<Link
					to="/dashboard/central"
					className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md hover:shadow-amber-400/10 transition block"
				>
					<p className="text-xs text-amber-100/70">Pending approvals</p>
					<p className="text-3xl font-semibold text-amber-100 mt-1">12</p>
					<p className="text-sm text-amber-100/70">Central dashboard (RC + HQ)</p>
				</Link>
				<Link
					to="/distributor"
					className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md hover:shadow-amber-400/10 transition block"
				>
					<p className="text-xs text-amber-100/70">Distributor-ready</p>
					<p className="text-3xl font-semibold text-amber-100 mt-1">8</p>
					<p className="text-sm text-amber-100/70">Approved by RC/HQ</p>
				</Link>
				<Link
					to="/analytics"
					className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md hover:shadow-amber-400/10 transition block"
				>
					<p className="text-xs text-amber-100/70">On-time delivery</p>
					<p className="text-3xl font-semibold text-amber-100 mt-1">92%</p>
					<p className="text-sm text-amber-100/70">See analytics</p>
				</Link>
				<Link
					to="/feedback"
					className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md hover:shadow-amber-400/10 transition block"
				>
					<p className="text-xs text-amber-100/70">Incoming feedbacks</p>
					<p className="text-3xl font-semibold text-amber-100 mt-1">34</p>
					<p className="text-sm text-amber-100/70">Filter and respond</p>
				</Link>
			</section>

			<section className="grid md:grid-cols-2 gap-3">
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<div className="flex items-center gap-2 mb-2">
						<CheckSquare className="w-4 h-4 text-amber-300" />
						<h2 className="text-lg font-semibold text-amber-100">Quick links</h2>
					</div>
					<div className="grid sm:grid-cols-2 gap-2 auto-rows-fr">
						<Link
							to="/dashboard/central"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Central dashboard</p>
							<p className="text-xs text-amber-100/70">Approve, cancel, and complete student orders.</p>
						</Link>
						<Link
							to="/dashboard/central"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Bulk requests</p>
							<p className="text-xs text-amber-100/70">RC / HQ supply asks with quick approve/reject.</p>
						</Link>
						<Link
							to="/zones"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Zones & hubs</p>
							<p className="text-xs text-amber-100/70">View RC links, capacity, and stock health.</p>
						</Link>
						<Link
							to="/analytics"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Analytics snapshot</p>
							<p className="text-xs text-amber-100/70">Deliveries, on-time %, stock, and trends.</p>
						</Link>
						<Link
							to="/feedback"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Feedback inbox</p>
							<p className="text-xs text-amber-100/70">Incoming feedback with filters.</p>
						</Link>
						<Link
							to="/register"
							className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 hover:border-amber-200/20 transition flex flex-col justify-center gap-1"
						>
							<p className="font-semibold text-amber-100">Register admin</p>
							<p className="text-xs text-amber-100/70">Invite or add an admin user.</p>
						</Link>
					</div>
				</div>
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<div className="flex items-center gap-2 mb-2">
						<BarChart3 className="w-4 h-4 text-amber-300" />
						<h2 className="text-lg font-semibold text-amber-100">Upcoming features</h2>
					</div>
					<div className="grid sm:grid-cols-2 gap-2 auto-rows-fr text-sm text-amber-100/80">
						<div className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3">
							<p className="font-semibold">Auto assignment</p>
							<p className="text-xs text-amber-100/70">Distributor capacity driven</p>
						</div>
						<div className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3">
							<p className="font-semibold">Delayed → HQ pickup</p>
							<p className="text-xs text-amber-100/70">Escalate overdue parcels</p>
						</div>
						<div className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3">
							<p className="font-semibold">Used-book intake</p>
							<p className="text-xs text-amber-100/70">Target 30% catalog</p>
						</div>
						<div className="h-full rounded-lg bg-slate-800/70 border border-amber-200/10 p-3">
							<p className="font-semibold">Live ETA maps</p>
							<p className="text-xs text-amber-100/70">Static → map-driven</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AdminDashboard;
