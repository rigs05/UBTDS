// Zone and hub details page with nearest highlight, search, filters, and varied notes.
import React, { useEffect, useMemo, useState } from "react";
import { MapPin, PenLine } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const ZoneHubDetails: React.FC = () => {
	const role = useSelector((state: RootState) => state.auth.user?.role);
	const canEdit = role === "ADMIN" || role === "RC_ADMIN";
	const [zones, setZones] = useState<any[]>([]);
	const [nearest, setNearest] = useState<any | null>(null);
	const [search, setSearch] = useState("");
	const [rcFilter, setRcFilter] = useState("all");
	const [maxDistance, setMaxDistance] = useState<number | null>(null);
	const [editZone, setEditZone] = useState<any | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await axios.get("/api/student/zones");
				setZones(res.data.zones || []);
				setNearest(res.data.nearest);
			} catch (err) {
				console.error("Unable to load zones", err);
			}
		};
		load();
	}, []);

	const filteredZones = useMemo(() => {
		return zones
			.filter((z) => {
				if (rcFilter !== "all" && z.rc !== rcFilter) return false;
				if (maxDistance !== null && z.distanceKm > maxDistance) return false;
				const q = search.toLowerCase();
				if (!q) return true;
				return (
					z.name.toLowerCase().includes(q) ||
					z.address.toLowerCase().includes(q) ||
					z.code.toLowerCase().includes(q)
				);
			})
			.sort((a, b) => a.distanceKm - b.distanceKm);
	}, [zones, search, rcFilter, maxDistance]);

	const rcOptions = useMemo(() => Array.from(new Set(zones.map((z) => z.rc))), [zones]);

	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center gap-3">
				<div className="p-3 rounded-xl bg-amber-400/15 border border-amber-200/30">
					<MapPin className="w-6 h-6 text-amber-200" />
				</div>
				<div>
					<p className="text-xs text-amber-100/70">50 zones • 100 hubs</p>
					<h1 className="text-2xl font-semibold text-amber-100">Zone & hub details</h1>
					<p className="text-sm text-amber-100/70">Overview of Zone's RC ownership, ratings, and monthly movement.</p>
				</div>
			</header>

			{nearest && (
				<section className="rounded-2xl bg-slate-900/80 border border-amber-200/15 shadow-xl backdrop-blur-md p-4">
					<p className="text-xs text-amber-100/70">Closest to you</p>
					<p className="text-xl font-semibold text-amber-100">{nearest.name}</p>
					<p className="text-sm text-amber-100/70">
						{nearest.address} • {nearest.distanceKm} km away • {nearest.rc}
					</p>
				</section>
			)}

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
				<div className="grid md:grid-cols-3 gap-3">
					<div className="md:col-span-2">
						<label className="text-xs text-amber-100/70">Search zones</label>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name, code, or address"
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">Max distance (km)</label>
						<input
							type="number"
							min="1"
							placeholder="e.g. 12"
							value={maxDistance ?? ""}
							onChange={(e) => setMaxDistance(e.target.value ? Number(e.target.value) : null)}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">Filter by RC</label>
						<select
							value={rcFilter}
							onChange={(e) => setRcFilter(e.target.value)}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						>
							<option value="all">All</option>
							{rcOptions.map((rc) => (
								<option key={rc} value={rc}>
									{rc}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>

			<section className="grid md:grid-cols-3 gap-3">
				{filteredZones.map((zone) => (
					<div
						key={zone.id}
						className="rounded-2xl bg-slate-900/80 border border-amber-200/15 shadow-xl backdrop-blur-md p-4 space-y-2"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-amber-100/70">
									{zone.code} • {zone.rc}
								</p>
								<p className="text-lg font-semibold text-amber-100">{zone.name}</p>
							</div>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-200/30 text-xs text-amber-100 font-semibold">
									{Math.min(5, 3.8 + (zone.stock % 4) * 0.2).toFixed(1)}/5
								</span>
								{canEdit && (
									<button
										title="Edit zone"
										onClick={() => setEditZone(zone)}
										className="p-2 h-fit rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30"
									>
										<PenLine className="w-4 h-4" />
									</button>
								)}
							</div>
						</div>
						<p className="text-xs text-amber-100/70">Location: {zone.address}</p>
						<p className="text-xs text-amber-100/70">Phone: {zone.phone}</p>
						<p className="text-xs text-amber-100/70">Distance: {zone.distanceKm} km</p>
						<p className="text-xs text-amber-100/80">Note: {zone.note}</p>
						<div className="grid grid-cols-2 gap-2 text-sm text-amber-100/80">
							<div className="rounded-lg bg-slate-800/70 border border-amber-200/10 p-2">
								<p className="text-xs text-amber-100/70">This month</p>
								<p className="text-base font-semibold text-amber-100">{Math.round(zone.stock * 0.4)}</p>
							</div>
							<div className="rounded-lg bg-slate-800/70 border border-amber-200/10 p-2">
								<p className="text-xs text-amber-100/70">Last month</p>
								<p className="text-base font-semibold text-amber-100">{Math.round(zone.stock * 0.35)}</p>
							</div>
						</div>
						<div className="flex items-center justify-between gap-2">
							<div className="rounded-lg bg-slate-800/70 border border-amber-200/10 p-2 text-sm text-amber-100/80 flex-1">
								<p className="text-xs text-amber-100/70">Stock ready</p>
								<p className="text-base font-semibold text-amber-100">{zone.stock}</p>
								<p className="text-xs text-amber-100/70 mt-1">{zone.note}</p>
							</div>
						</div>
					</div>
				))}
			</section>

			{canEdit && editZone && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
					<div className="bg-slate-900 border border-amber-200/20 rounded-2xl p-5 max-w-xl w-full shadow-2xl space-y-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-amber-100/70">Edit zone</p>
								<h3 className="text-lg font-semibold text-amber-100">{editZone.name}</h3>
							</div>
							<button
								onClick={() => setEditZone(null)}
								className="text-amber-50 hover:text-amber-200 text-sm px-3 py-1 rounded-lg border border-amber-200/20"
							>
								Close
							</button>
						</div>
						<div className="grid sm:grid-cols-2 gap-3 text-sm text-amber-100/80">
							<div>
								<label className="text-xs text-amber-100/70">Name</label>
								<input
									value={editZone.name}
									onChange={(e) => setEditZone({ ...editZone, name: e.target.value })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">RC</label>
								<select
									value={editZone.rc}
									onChange={(e) => setEditZone({ ...editZone, rc: e.target.value })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								>
									{rcOptions.map((rc) => (
										<option key={rc} value={rc}>
											{rc}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Address</label>
								<input
									value={editZone.address}
									onChange={(e) => setEditZone({ ...editZone, address: e.target.value })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Phone</label>
								<input
									value={editZone.phone}
									onChange={(e) => setEditZone({ ...editZone, phone: e.target.value })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Note</label>
								<input
									value={editZone.note}
									onChange={(e) => setEditZone({ ...editZone, note: e.target.value })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Distance (km)</label>
								<input
									type="number"
									value={editZone.distanceKm}
									onChange={(e) => setEditZone({ ...editZone, distanceKm: Number(e.target.value) })}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setEditZone(null)}
								className="px-4 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									setZones((prev) => prev.map((z) => (z.id === editZone.id ? editZone : z)));
									setEditZone(null);
								}}
								className="px-4 py-2 rounded-lg bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ZoneHubDetails;
