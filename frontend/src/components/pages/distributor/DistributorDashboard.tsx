// Distributor dashboard showing RC/HQ-approved items only.
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { centralDashboardEntries } from "../../../data/mockData";
import type { RootState } from "../../../store/store";

const DistributorDashboard: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user);
	const approved = useMemo(
		() => centralDashboardEntries.filter((row) => ["Approved", "Completed"].includes(row.status)),
		[]
	);

	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
				<p className="text-xs text-amber-100/70">25 distributors mapped to 50 zones</p>
				<h1 className="text-2xl font-semibold text-amber-100">Distributor dashboard</h1>
				<p className="text-sm text-amber-100/70">Only entries approved by RC/HQ are listed here.</p>
				{user && (
					<p className="text-xs text-amber-100/70 mt-1">
						Logged in as {user.firstName} {user.lastName || ""} • {user.email}
					</p>
				)}
			</header>

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-amber-100/70">
								<th className="py-2 pr-4">Enrollment</th>
								<th className="py-2 pr-4">Requested from</th>
								<th className="py-2 pr-4">Order type</th>
								<th className="py-2 pr-4">Payment</th>
								<th className="py-2 pr-4">Status</th>
							</tr>
						</thead>
						<tbody>
							{approved.map((row) => (
								<tr key={row.serial} className="border-t border-amber-200/10">
									<td className="py-3 pr-4 text-amber-100/90">{row.enrollment}</td>
									<td className="py-3 pr-4 text-amber-100/80">{row.requestedFrom}</td>
									<td className="py-3 pr-4 capitalize text-amber-100/80">{row.orderType}</td>
									<td className="py-3 pr-4 text-amber-100/80">{row.paymentMode}</td>
									<td className="py-3 pr-4">
										<span className="px-2 py-1 rounded-lg border border-amber-200/20 bg-slate-800/70 text-amber-100/90">
											{row.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default DistributorDashboard;
