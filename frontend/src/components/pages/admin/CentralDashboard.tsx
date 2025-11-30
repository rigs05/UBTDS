// Central dashboard for RC/HQ with approvals, status dropdown, detail modal, and bulk actions.
import React, { useEffect, useMemo, useState } from "react";
import { Check, Info, MoreHorizontal, X } from "lucide-react";
import axios from "axios";
import { bulkRequests as mockBulk, centralDashboardEntries as mockEntries } from "../../../data/mockData";

const statuses = ["All", "Pending", "Approved", "Cancelled", "Completed", "Dispatched", "In-Transit"] as const;

const statusColor = (status: string) => {
	const map: Record<string, string> = {
		Approved: "bg-emerald-500/20 border-emerald-300/30 text-emerald-100",
		"Contact HQ": "bg-amber-500/25 border-amber-300/30 text-amber-50",
		Completed: "bg-green-500/20 border-green-300/30 text-green-100",
		Cancelled: "bg-rose-500/20 border-rose-300/30 text-rose-100",
		Dispatched: "bg-indigo-500/20 border-indigo-300/30 text-indigo-100",
		"In-Transit": "bg-orange-500/20 border-orange-300/30 text-orange-100",
		Pending: "bg-amber-500/20 border-amber-300/30 text-amber-100",
		Rejected: "bg-rose-500/20 border-rose-300/30 text-rose-100",
		REJECTED: "bg-rose-500/20 border-rose-300/30 text-rose-100",
		APPROVED: "bg-emerald-500/20 border-emerald-300/30 text-emerald-100",
		COMPLETED: "bg-green-500/20 border-green-300/30 text-green-100",
		CANCELLED: "bg-rose-500/20 border-rose-300/30 text-rose-100",
	};
	return map[status] || "bg-slate-500/20 border-slate-300/30 text-amber-50";
};

const CentralDashboard: React.FC = () => {
	const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>("All");
	const [search, setSearch] = useState("");
	const initialEntries = mockEntries.map((m) => ({ ...m, id: (m as any).id || `mock-${m.serial}` }));
	const [entries, setEntries] = useState(initialEntries);
	const [selected, setSelected] = useState(initialEntries[0]);
	const [pickupRequests, setPickupRequests] = useState<any[]>([]);
	const [processedPickups, setProcessedPickups] = useState<any[]>([]);
	const [bulk, setBulk] = useState(mockBulk);
	const [dropdownFor, setDropdownFor] = useState<number | null>(null);
	const [showModal, setShowModal] = useState(false);
	const syncEntryStatusToMock = (serial: number, status: string) => {
		const idx = mockEntries.findIndex((e) => e.serial === serial);
		if (idx >= 0) {
			mockEntries[idx].status = status;
		}
	};

	const syncBulkStatusToMock = (id: string, status: string) => {
		const idx = mockBulk.findIndex((b) => b.id === id);
		if (idx >= 0) {
			mockBulk[idx].status = status;
		}
	};

	const buildTxnId = (orderedAt?: string, idx?: number) => {
		const date = orderedAt ? new Date(orderedAt) : new Date();
		const yy = date.getFullYear().toString().slice(-2);
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		const rand = Math.floor(Math.random() * 1_000_000_0000)
			.toString()
			.padStart(10, "0");
		return `OA1D-${yy}${mm}${dd}-${rand}${idx ?? ""}`;
	};

	useEffect(() => {
		const load = async () => {
			try {
				const [dashRes, pickupRes] = await Promise.all([
					axios.get("/api/admin/dashboard"),
					axios.get("/api/admin/pickup-requests"),
				]);
				const mapped = (dashRes.data.orders || []).map((o: any, idx: number) => {
					const booksFromItems = Array.isArray(o.items)
						? o.items
								.map((item: any) => item?.title || item?.code || item?.name)
								.filter(Boolean)
						: [];
					return {
						serial: idx + 1,
						enrollment: o.enrollment || "2201234567",
						date: o.orderedAt || "",
						requestedFrom: o.currentLocation || "HQ",
						orderType: o.orderType || "mixed",
						txnId: o.txnId || buildTxnId(o.orderedAt, idx),
						paymentMode: o.paymentMode || "UPI",
						mobile: o.mobile || "+91-9876543210",
						status: o.status || "Pending",
						name: o.name || "Student Name",
						address: o.address || "New Delhi 110001",
						books: booksFromItems.length ? booksFromItems : o.books || [],
					};
				});
				const merged = mapped.length ? mapped : mockEntries;
				const withIds = merged.map((m: any) => ({ ...m, id: m.id || `order-${m.serial || Math.random().toString(36).slice(2)}` }));
				setEntries(withIds);
				setSelected(withIds[0]);
				const reqs = pickupRes.data.requests || [];
				setPickupRequests(reqs.filter((r: any) => (r.status || "Pending").toLowerCase() === "pending"));
				setProcessedPickups(reqs.filter((r: any) => (r.status || "").toLowerCase() !== "pending"));
				setBulk(mockBulk);
			} catch (err) {
				console.error("Unable to load dashboard", err);
			}
		};
		load();
	}, []);

	const filtered = useMemo(() => {
		return entries.filter((item) => {
			const statusMatch =
				statusFilter === "All" ||
				(item.status || "").toLowerCase() === statusFilter.toLowerCase();
			if (!statusMatch) return false;
			if (search && !item.enrollment.toLowerCase().includes(search.toLowerCase())) return false;
			return true;
		});
	}, [entries, search, statusFilter]);

	const updateStatus = async (id: string, serial: number, status: string) => {
		if (status === "All") return;
		setEntries((prev) => prev.map((item) => (item.serial === serial ? { ...item, status } : item)));
		syncEntryStatusToMock(serial, status);
		// Skip backend call if this is a mock/fallback id
		if (!id || id.startsWith("mock") || id.startsWith("order-")) return;
		try {
			await axios.patch(`/api/admin/orders/${id}/status`, { status });
		} catch (err) {
			console.error("Unable to update order status", err);
		}
	};

	const updatePickup = async (id: string, status: string) => {
		setPickupRequests((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
		try {
			await axios.patch(`/api/admin/pickup-requests/${id}`, { status });
			setPickupRequests((prev) => prev.filter((p) => p.id !== id));
			setProcessedPickups((prev) => {
				const existing = prev.find((p) => p.id === id);
				if (existing) {
					return prev.map((p) => (p.id === id ? { ...p, status } : p));
				}
				const pending = pickupRequests.find((p) => p.id === id);
				return pending ? [...prev, { ...pending, status }] : prev;
			});
		} catch (err) {
			console.error("Unable to update pickup request", err);
		}
	};

	const updateBulkStatus = async (id: string, status: string) => {
		setBulk((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
		syncBulkStatusToMock(id, status);
		try {
			await axios.patch(`/api/admin/bulk-requests/${id}/status`, { status });
		} catch (err) {
			console.error("Unable to update bulk request status", err);
		}
	};

	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center justify-between flex-wrap gap-3">
				<div>
					<p className="text-xs text-amber-100/70">RC + Headquarters view</p>
					<h1 className="text-2xl font-semibold text-amber-100">
						Central dashboard
					</h1>
					<p className="text-sm text-amber-100/70">
						Approve/cancel/complete requests. Distributor view is restricted to
						approved items.
					</p>
				</div>
				<div className="flex gap-2">
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(e.target.value as (typeof statuses)[number])
						}
						className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
					>
						{statuses.map((s) => (
							<option key={s}>{s}</option>
						))}
					</select>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search enrollment no."
						className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
					/>
				</div>
			</header>

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-lg font-semibold text-amber-100">
						Pickup requests (student)
					</h2>
					<span className="text-xs text-amber-100/70">
						Approve / Reject Pickup Requests
					</span>
				</div>
				<div className="grid md:grid-cols-2 gap-2">
					{pickupRequests.map((req) => (
						<div
							key={req.id}
							className="rounded-xl border border-amber-200/10 bg-slate-800/60 p-3 flex justify-between items-center"
						>
							<div>
								<p className="text-sm font-semibold text-amber-100">
									{req.location}
								</p>
								<p className="text-xs text-amber-100/70">
									{req.enrollment} • {req.status}
								</p>
							</div>
							<div className="flex gap-1">
								<button
									title="Approve"
									onClick={() => updatePickup(req.id, "APPROVED")}
									className="px-2 py-1 rounded-lg bg-slate-900/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 text-xs cursor-pointer"
								>
									<Check className="w-3 h-3" />
								</button>
								<button
									title="Reject"
									onClick={() => updatePickup(req.id, "REJECTED")}
									className="px-2 py-1 rounded-lg bg-slate-900/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 text-xs cursor-pointer"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{processedPickups.length > 0 && (
				<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-lg font-semibold text-amber-100">Processed pickup requests</h2>
						<span className="text-xs text-amber-100/70">Recently approved/rejected</span>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="text-left text-amber-100/70">
									<th className="py-2 pr-4">Enrollment</th>
									<th className="py-2 pr-4">Location</th>
									<th className="py-2 pr-4">Status</th>
									<th className="py-2 pr-4">Requested At</th>
								</tr>
							</thead>
							<tbody>
								{processedPickups.map((req) => (
									<tr key={req.id} className="border-t border-amber-200/10">
										<td className="py-3 pr-4 text-amber-100/80">{req.enrollment || "N/A"}</td>
										<td className="py-3 pr-4 text-amber-100/80">{req.location}</td>
										<td className="py-3 pr-4">
											<span className={`${statusColor(req.status)} px-2 py-1 rounded-lg border inline-block`}>
												{req.status}
											</span>
										</td>
										<td className="py-3 pr-4 text-amber-100/70 text-xs">
											{req.requestedAt ? new Date(req.requestedAt).toLocaleString() : "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-amber-100/70">
								<th className="py-2 pr-4">S/N</th>
								<th className="py-2 pr-4">Enrollment</th>
								<th className="py-2 pr-4">Requested from</th>
								<th className="py-2 pr-4">Order Type</th>
								<th className="py-2 pr-4 text-center">Transaction</th>
								<th className="py-2 pr-4">Payment</th>
								<th className="py-2 pr-4 text-center">Mobile</th>
								<th className="py-2 pr-4 text-center">Status</th>
								<th className="py-2 pr-4 text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((row) => (
								<tr key={row.serial} className="border-t border-amber-200/10">
									<td className="py-3 pr-4 text-amber-100/80">{row.serial}</td>
									<td className="py-3 pr-4 font-semibold text-amber-100">
										{row.enrollment}
									</td>
									<td className="py-3 pr-4 text-amber-100/80">
										{row.requestedFrom}
									</td>
									<td className="py-3 pr-4 capitalize text-amber-100/80">
										{row.orderType}
									</td>
									<td className="py-3 pr-4 text-amber-100/80">{row.txnId}</td>
									<td className="py-3 pr-4 text-amber-100/80 text-center">
										{row.paymentMode}
									</td>
									<td className="py-3 pr-4 text-amber-100/80">{row.mobile}</td>
									<td className="py-3 pr-4">
										<span
											className={`${statusColor(
												row.status
											)} px-2 py-1 rounded-lg border inline-block`}
										>
											{row.status}
										</span>
									</td>
									<td className="py-3 pr-4">
										<div className="flex gap-2 relative">
											<button
												onClick={() => updateStatus((row as any).id || "", row.serial, "Approved")}
												title="Approve"
												className="p-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
											>
												<Check className="w-4 h-4" />
											</button>
											<button
												onClick={() => updateStatus((row as any).id || "", row.serial, "Cancelled")}
												title="Cancel"
												className="p-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
											>
												<X className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													setDropdownFor(
														dropdownFor === row.serial ? null : row.serial
													)
												}
												title="Change status"
												className="relative p-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
											>
												<MoreHorizontal className="w-4 h-4" />
												{dropdownFor === row.serial && (
													<div className="absolute right-0 mt-2 w-36 rounded-lg bg-slate-900 border border-amber-200/20 shadow-xl z-10">
														{[
															"Completed",
															"Pending",
															"Dispatched",
															"In-Transit",
														].map((opt) => (
															<button
																key={opt}
																onClick={() => {
																	updateStatus((row as any).id || "", row.serial, opt);
																	setDropdownFor(null);
																}}
																className="w-full text-left px-3 py-2 text-xs text-amber-100 hover:bg-slate-800"
															>
																{opt}
															</button>
														))}
													</div>
												)}
											</button>
											<button
												onClick={() => {
													setSelected(row);
													setShowModal(true);
												}}
												title="Details"
												className="p-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
											>
												<Info className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{showModal && selected && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
					<div className="bg-slate-900 border border-amber-200/20 rounded-2xl p-5 max-w-2xl w-full shadow-2xl space-y-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-amber-100/70">Order details</p>
								<h3 className="text-lg font-semibold text-amber-100">
									{selected.txnId}
								</h3>
							</div>
							<button
								onClick={() => setShowModal(false)}
								className="text-amber-50 hover:text-amber-200 text-sm px-3 py-1 rounded-lg border border-amber-200/20"
							>
								Close
							</button>
						</div>
						<div className="grid sm:grid-cols-2 gap-3 text-sm text-amber-100/80">
							<div className="rounded-xl bg-slate-800/70 border border-amber-200/10 p-3 space-y-1">
								<p className="text-xs text-amber-100/60">Student</p>
								<p className="text-base font-semibold text-amber-100">
									{selected.enrollment}
								</p>
								<p className="text-xs text-amber-100/60">
									Name: {selected.name || "N/A"}
								</p>
								<p className="text-xs text-amber-100/60">
									Mobile: {selected.mobile}
								</p>
							</div>
							<div className="rounded-xl bg-slate-800/70 border border-amber-200/10 p-3 space-y-1">
								<p className="text-xs text-amber-100/60">Order</p>
								<p className="text-base font-semibold text-amber-100">
									{selected.orderType} • {selected.requestedFrom}
								</p>
								<p className="text-xs text-amber-100/60">
									Payment: {selected.paymentMode}
								</p>
								<p className="text-xs text-amber-100/60">
									Status: {selected.status}
								</p>
							</div>
						</div>
						<div className="rounded-xl bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80 space-y-1">
							<p className="text-xs text-amber-100/60">Address</p>
							<p>{selected.address || "Address not captured"}</p>
							<p className="text-xs text-amber-100/60">
								Ordered: {selected.date || "N/A"}
							</p>
						</div>
						<div className="rounded-xl bg-slate-800/70 border border-amber-200/10 p-3 text-sm text-amber-100/80">
							<p className="text-xs text-amber-100/60">Books</p>
							{selected.books && selected.books.length > 0 ? (
								<ul className="mt-1 space-y-1">
									{selected.books.map((book, idx) => (
										<li key={book + idx} className="text-xs text-amber-100/80">
											• {book}
										</li>
									))}
								</ul>
							) : (
								<p className="text-xs text-amber-100/70">
									No books attached to this order.
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
				<div className="flex items-center justify-between mb-3">
					<div>
						<h2 className="text-lg font-semibold text-amber-100">
							Bulk material requests
						</h2>
						<p className="text-sm text-amber-100/70">
							RCs, distributors, and HQ supply asks.
						</p>
					</div>
					<span className="text-xs text-amber-100/70">
						Simple count/status updates only
					</span>
				</div>
				<div className="grid md:grid-cols-2 gap-3">
					{bulk.map((req) => (
						<div
							key={req.id}
							className="rounded-xl border border-amber-200/10 bg-slate-800/60 p-3 grid grid-cols-[1fr_auto] gap-3"
						>
							<div>
								<p className="text-sm font-semibold text-amber-100">
									{req.requestor}
								</p>
								<p className="text-xs text-amber-100/70">
									{req.book} • {req.count} copies
								</p>
								<p className="text-xs text-amber-100/60">Note: {req.note}</p>
								<p className="text-xs text-amber-100/60">
									Payment: {req.payment}
								</p>
								<p className="text-xs text-amber-100/60">
									Date: {req.date || "N/A"}
								</p>
							</div>
							<div className="flex flex-col gap-2 items-start">
								<span
									className={`h-fit px-2 py-1 rounded-lg border text-xs font-semibold ${statusColor(
										req.status
									)}`}
								>
									{req.status}
								</span>
								<div className="flex gap-1">
									<button
										title="Approve"
										onClick={() => updateBulkStatus(req.id, "Approved")}
										className="p-1 rounded-lg bg-slate-900/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
									>
										<Check className="w-3 h-3" />
									</button>
									<button
										title="Reject"
										onClick={() => updateBulkStatus(req.id, "Rejected")}
										className="p-1 rounded-lg bg-slate-900/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
									<button
										title="Contact HQ"
										onClick={() => updateBulkStatus(req.id, "Contact HQ")}
										className="p-1 rounded-lg bg-slate-900/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 cursor-pointer"
									>
										<Info className="w-3 h-3" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default CentralDashboard;
