// Student dashboard focused on Delhi delivery flow, pickups, history, and recommendations.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, History, MapPin, Package, PackageCheck, Truck } from "lucide-react";
import { referenceStrip } from "../../../data/mockData";

const statusIconMap: Record<string, any> = {
	Dispatched: Package,
	"In Transit": Truck,
	Arrived: PackageCheck,
	"Ready for Pickup": CheckCircle2,
	"Out for Delivery": Clock,
};

interface TrackingPayload {
	currentLocation?: string;
	rc?: string;
	region?: string;
	timeline: any[];
}

interface ProfilePayload {
	rcName?: string;
	rcCode?: string;
	address?: { line1: string; city: string; state: string; pincode: string };
}

const StudentDashboard: React.FC = () => {
	const [pickupChoice, setPickupChoice] = useState<string>("");
	const [requestMessage, setRequestMessage] = useState<string | null>(null);
	const [tracking, setTracking] = useState<TrackingPayload>({ timeline: [] });
	const [profile, setProfile] = useState<ProfilePayload>({});
	const [historyOpen, setHistoryOpen] = useState(false);
	const [history, setHistory] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [trackRes, profileRes, historyRes] = await Promise.all([
					axios.get("/api/student/track"),
					axios.get("/api/student/profile"),
					axios.get("/api/student/orders/history"),
				]);
				setTracking(trackRes.data);
				setProfile(profileRes.data);
				setHistory(historyRes.data.orders || []);
				const pickupable = (trackRes.data.timeline || []).filter((e: any) => e.allowPickup).map((e: any) => e.location);
				setPickupChoice(pickupable[0] || "Headquarters (Maidan Garhi)");
			} catch (err: any) {
				console.error("Failed to load tracking/profile/history", err);
				toast.error("Unable to load tracking data right now.");
			}
		};
		fetchData();
	}, []);

	const pickupOptions = useMemo(() => {
		return (tracking.timeline || []).filter((e: any) => e.allowPickup).map((e: any) => e.location);
	}, [tracking.timeline]);

	const handlePickupRequest = async () => {
		try {
			await axios.post("/api/student/pickup-request", { location: pickupChoice });
			setRequestMessage("Pickup request sent for admin approval.");
			toast.success("Pickup request sent for admin approval.");
		} catch {
			const msg = "Unable to send pickup request right now.";
			setRequestMessage(msg);
			toast.error(msg);
		}
	};

	return (
		<div className="space-y-6 text-amber-50">
			<header className="bg-linear-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-amber-100/70">Delhi Region • {profile.rcName || "RC-02"}</p>
						<h1 className="text-3xl font-semibold text-amber-100 mt-1">Track & Collect</h1>
						<p className="text-sm text-amber-100/70 mt-2">
							Headquarters dispatch → your RC → 50 zones / 100 hubs → doorstep or pickup.
						</p>
					</div>
					<div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-lg border border-amber-200/20">
						<MapPin className="w-4 h-4 text-amber-300" />
						<span className="text-sm">
							Current stop: {tracking.currentLocation || "HQ dispatch"} • HQ pickup until &lt;=5km
						</span>
					</div>
				</div>
			</header>

			<section className="grid lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 space-y-4">
					<div className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-amber-100">Delivery timeline (Delhi)</h2>
							<span className="text-xs text-amber-100/70">HQ → RC → Zones → Hubs</span>
						</div>
						<div className="mt-4 space-y-3">
							{(tracking.timeline || []).map((event: any, idx: number) => {
								const Icon = statusIconMap[event.status] || Package;
								const isLast = idx === (tracking.timeline || []).length - 1;
								return (
									<div
										key={event.id || idx}
										className="relative rounded-xl border border-amber-200/10 bg-slate-800/60 p-3 flex items-start gap-3 hover:shadow-lg hover:shadow-amber-400/10 transition"
									>
										<div className="flex flex-col items-center">
											<div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
												<Icon className="w-5 h-5 text-amber-200" />
											</div>
											{!isLast && <span className="flex-1 w-px bg-amber-200/20 mt-1" />}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm text-amber-100/70">{event.timestamp}</p>
													<p className="text-base font-semibold text-amber-50">{event.location}</p>
													<p className="text-xs uppercase tracking-wide text-amber-100/60">{event.type}</p>
												</div>
												<div className="text-right">
													<span className="text-sm font-semibold text-amber-200">{event.status}</span>
													{typeof event.etaDays === "number" && (
														<p className="text-xs text-amber-100/70">ETA: {event.etaDays} day(s)</p>
													)}
												</div>
											</div>
											<p className="text-sm text-amber-100/80 mt-1">{event.note}</p>
											{event.allowPickup && (
												<p className="text-xs text-amber-200 mt-1">
													Pickup enabled at this stop (HQ + current hub/RC).
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
						<div className="flex items-center justify-between flex-wrap gap-3">
							<div>
								<h3 className="text-lg font-semibold text-amber-100">Pickup or doorstep</h3>
								<p className="text-sm text-amber-100/70">
									Choose a hub/zone while in transit. HQ pickup allowed until the parcel is within 5km.
								</p>
							</div>
							<select
								value={pickupChoice}
								onChange={(e) => setPickupChoice(e.target.value)}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
							>
								{pickupOptions.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
						</div>
						<div className="mt-3 grid sm:grid-cols-3 gap-3">
							<div className="rounded-xl border border-amber-200/10 bg-slate-800/70 p-3">
								<p className="text-xs text-amber-100/70">Current pickup</p>
								<p className="text-base font-semibold text-amber-100">{pickupChoice}</p>
							</div>
							<div className="rounded-xl border border-amber-200/10 bg-slate-800/70 p-3">
								<p className="text-xs text-amber-100/70">Doorstep ETA</p>
								<p className="text-base font-semibold text-amber-100">Within 24 hours</p>
							</div>
							<div className="rounded-xl border border-amber-200/10 bg-slate-800/70 p-3">
								<p className="text-xs text-amber-100/70">Action</p>
								<button
									onClick={handlePickupRequest}
									className="w-full px-3 py-2 rounded-lg bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition"
								>
									Request pickup here
								</button>
							</div>
						</div>
						{requestMessage && <p className="text-sm text-amber-100/80 mt-2">{requestMessage}</p>}
					</div>
				</div>

				<div className="space-y-4">
					<div className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
						<h3 className="text-lg font-semibold text-amber-100">Reference picks</h3>
						<p className="text-sm text-amber-100/70 mb-3">Add-on study aids while you wait.</p>
						<div className="space-y-2">
							{referenceStrip.map((ref) => (
								<Link
									to="/catalog"
									key={ref.code}
									className="flex items-center justify-between rounded-lg border border-amber-200/10 bg-slate-800/60 px-3 py-2 hover:border-amber-300/30 transition"
								>
									<div>
										<p className="text-sm font-semibold text-amber-100">{ref.code}</p>
										<p className="text-xs text-amber-100/70">{ref.title}</p>
									</div>
									<span className="text-xs text-amber-200">{ref.eta}</span>
								</Link>
							))}
						</div>
					</div>

					<div className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-2">
						<h3 className="text-lg font-semibold text-amber-100">Delivery info</h3>
						<ul className="list-disc list-inside text-sm text-amber-100/80 space-y-1">
							<li>HQ remains a pickup option until the parcel is ≤5km from your address.</li>
							<li>We stay on delivery by default—pickup is optional.</li>
							<li>Fast lanes enabled for Delhi region RCs (RC-01/02/03).</li>
						</ul>
					</div>

					<div className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
						<button
							onClick={() => setHistoryOpen((s) => !s)}
							className="flex items-center justify-between w-full text-left text-amber-100 font-semibold"
						>
							<span className="flex items-center gap-2">
								<History className="w-4 h-4 text-amber-300" />
								Order history
							</span>
							<span className="text-sm text-amber-100/70">{historyOpen ? "Hide" : "Show"}</span>
						</button>
						{historyOpen && (
							<div className="space-y-2">
								{history.map((order) => (
									<div
										key={order.id}
										className="rounded-lg border border-amber-200/10 bg-slate-800/60 p-3 hover:shadow-lg hover:shadow-amber-400/10 transition"
									>
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold text-amber-100">{order.status}</p>
											<p className="text-xs text-amber-100/70">{order.orderedAt}</p>
										</div>
										<p className="text-xs text-amber-100/70 mt-1">
											ETA: {order.deliveryEtaDays} day(s) • {order.currentLocation}
										</p>
										<div className="flex flex-wrap gap-2 mt-2 text-xs text-amber-100/80">
											{order.items.map((it: any) => (
												<span
													key={`${order.id}-${it.code}`}
													className="px-2 py-1 rounded-lg bg-slate-900/70 border border-amber-200/15"
												>
													{it.code} × {it.qty}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default StudentDashboard;
