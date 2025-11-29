// Static analytics snapshot for dispatches, stock, and performance.
import React from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { analyticsSnapshot } from "../../../data/mockData";

const AnalyticsPage: React.FC = () => {
	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center gap-3">
				<div className="p-3 rounded-xl bg-amber-400/15 border border-amber-200/30">
					<TrendingUp className="w-6 h-6 text-amber-200" />
				</div>
				<div>
					<p className="text-xs text-amber-100/70">HQ + RC + Zones</p>
					<h1 className="text-2xl font-semibold text-amber-100">Analytics overview</h1>
					<p className="text-sm text-amber-100/70">Dispatches, stock posture, and engagement snapshot.</p>
				</div>
			</header>

			<section className="grid md:grid-cols-3 gap-3">
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<h3 className="text-sm text-amber-100/70">Dispatches</h3>
					<p className="text-3xl font-semibold text-amber-100 mt-1">{analyticsSnapshot.dispatches.hq + analyticsSnapshot.dispatches.rc + analyticsSnapshot.dispatches.zones}</p>
					<ul className="text-xs text-amber-100/80 mt-2 space-y-1">
						<li>HQ: {analyticsSnapshot.dispatches.hq}</li>
						<li>RCs: {analyticsSnapshot.dispatches.rc}</li>
						<li>Zones: {analyticsSnapshot.dispatches.zones}</li>
					</ul>
				</div>
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<h3 className="text-sm text-amber-100/70">Stock</h3>
					<p className="text-3xl font-semibold text-amber-100 mt-1">{analyticsSnapshot.stock.hq + analyticsSnapshot.stock.rc + analyticsSnapshot.stock.zones}</p>
					<ul className="text-xs text-amber-100/80 mt-2 space-y-1">
						<li>HQ: {analyticsSnapshot.stock.hq}</li>
						<li>RCs: {analyticsSnapshot.stock.rc}</li>
						<li>Zones: {analyticsSnapshot.stock.zones}</li>
					</ul>
				</div>
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<h3 className="text-sm text-amber-100/70">Overall sales</h3>
					<p className="text-3xl font-semibold text-amber-100 mt-1">₹{analyticsSnapshot.sales.valueInCrores} Cr</p>
					<p className="text-xs text-amber-100/80 mt-2">Last month: ₹{analyticsSnapshot.sales.lastMonth} Cr</p>
				</div>
			</section>

			<section className="grid md:grid-cols-2 gap-3">
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<div className="flex items-center gap-2 mb-2">
						<BarChart3 className="w-4 h-4 text-amber-300" />
						<h3 className="text-lg font-semibold text-amber-100">Population</h3>
					</div>
					<ul className="text-sm text-amber-100/80 space-y-1">
						<li>Students: {analyticsSnapshot.totals.students.toLocaleString()}</li>
						<li>Zones: {analyticsSnapshot.totals.zones}</li>
						<li>Hubs: {analyticsSnapshot.totals.hubs}</li>
						<li>Distributors: {analyticsSnapshot.totals.distributors}</li>
					</ul>
				</div>
				<div className="rounded-2xl bg-slate-900/80 border border-amber-200/15 p-4 shadow-xl backdrop-blur-md">
					<div className="flex items-center gap-2 mb-2">
						<PieChart className="w-4 h-4 text-amber-300" />
						<h3 className="text-lg font-semibold text-amber-100">Past analytics</h3>
					</div>
					<div className="grid sm:grid-cols-3 gap-2">
						{analyticsSnapshot.pastAnalytics.map((item) => (
							<div key={item.label} className="rounded-xl border border-amber-200/10 bg-slate-800/60 p-3">
								<p className="text-xs text-amber-100/70">{item.label}</p>
								<p className="text-lg font-semibold text-amber-100">{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default AnalyticsPage;
