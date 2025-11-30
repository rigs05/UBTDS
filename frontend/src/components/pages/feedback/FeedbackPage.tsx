// Feedback page reused by students/distributors for submissions and admins for inbox view.
import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

type FeedbackFor = "student" | "distributor";

type IncomingFeedback = {
	id: string;
	sender: "student" | "distributor";
	name: string;
	enrollment?: string;
	date: string;
	feedbackType: string;
	message: string;
};

const incomingFeedbacks: IncomingFeedback[] = [
	{ id: "fb-1", sender: "student", name: "Amit Sharma", enrollment: "2201234567", date: "2025-11-26", feedbackType: "Delivery", message: "Package delayed by 2 days, please improve courier coordination." },
	{ id: "fb-2", sender: "distributor", name: "Distributor D-09", date: "2025-11-25", feedbackType: "Stock", message: "Need faster replenishment for BCS-011, stock-outs frequent." },
	{ id: "fb-3", sender: "student", name: "Priya Verma", enrollment: "2202234567", date: "2025-11-24", feedbackType: "Experience", message: "Pickup slot was smooth, appreciate status updates." },
	{ id: "fb-4", sender: "student", name: "Rahul Singh", enrollment: "2203234567", date: "2025-11-24", feedbackType: "Complaint", message: "Received wrong edition for MCS-034. Please replace." },
];

const FeedbackPage: React.FC = () => {
	const userRole = useSelector((state: RootState) => state.auth.user?.role);
	const isAdminView = userRole === "ADMIN" || userRole === "RC_ADMIN";
	const [feedbackFor, setFeedbackFor] = useState<FeedbackFor>("student");
	const initialForm = { enrollment: "", name: "", feedbackType: "Delivery", message: "", contact: "" };
	const [form, setForm] = useState(initialForm);
	const [submitted, setSubmitted] = useState(false);
	const [senderFilter, setSenderFilter] = useState<"all" | "student" | "distributor">("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [dateFilter, setDateFilter] = useState<string>("");
	const [inbox, setInbox] = useState<IncomingFeedback[]>(incomingFeedbacks);

	useEffect(() => {
		if (isAdminView) return;
		const fetchProfile = async () => {
			try {
				const res = await axios.get("/api/student/profile");
				const { enrollmentNo, firstName, lastName, phone } = res.data || {};
				setForm((prev) => ({
					...prev,
					enrollment: enrollmentNo || prev.enrollment,
					name: [firstName, lastName].filter(Boolean).join(" ") || prev.name,
					contact: phone || prev.contact,
				}));
			} catch {
				// leave as-is if profile not available
			}
		};
		fetchProfile();
	}, [isAdminView]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// const filteredFeedbacks = incomingFeedbacks.filter((fb) => {
	// 	const senderMatch = senderFilter === "all" || fb.sender === senderFilter;
	// 	const typeMatch = typeFilter === "all" || fb.feedbackType === typeFilter;
	// 	const dateMatch = !dateFilter || fb.date === dateFilter;
	// 	return senderMatch && typeMatch && dateMatch;
	// });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		axios
			.post("/api/student/feedback", {
				enrollment: form.enrollment,
				name: form.name,
				feedbackType: form.feedbackType,
				message: form.message,
				contact: form.contact,
				role: feedbackFor === "student" ? "STUDENT" : "DISTRIBUTOR",
			})
			.then(() => {
				toast.success("Feedback submitted");
				setForm(initialForm);
				setSubmitted(true);
				setTimeout(() => setSubmitted(false), 2000);
			})
			.catch(() => {
				toast.error("Unable to submit feedback right now.");
			});
	};

	// Load inbox for admins
	useEffect(() => {
		if (!isAdminView) return;
		const load = async () => {
			try {
				const res = await axios.get("/api/admin/feedback");
				const data = res.data.feedback || [];
				const mapped: IncomingFeedback[] = data.map((fb: any) => ({
					id: fb.id,
					sender: (fb.role || fb.senderRole || "student").toString().toLowerCase().includes("distributor")
						? "distributor"
						: "student",
					name: fb.name || fb.user?.firstName || "User",
					date: fb.date || fb.createdAt || "",
					feedbackType: fb.feedbackType || "General",
					message: fb.message,
					enrollment: fb.enrollment,
				}));
				setInbox(mapped);
			} catch (err) {
				console.error("Unable to load feedback inbox", err);
				toast.error("Unable to load feedback inbox");
				setInbox(incomingFeedbacks);
			}
		};
		load();
	}, [isAdminView]);

	return (
		<div className="max-w-4xl mx-auto space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
				<p className="text-xs text-amber-100/70">Feedback • Delivery • Stock • Experience</p>
				<h1 className="text-2xl font-semibold text-amber-100">{isAdminView ? "Feedback inbox" : "Share quick feedback"}</h1>
				<p className="text-sm text-amber-100/70">
					{isAdminView
						? "View and filter all incoming feedback across students and distributors."
						: "Your feedback provides us valuable insight to improve our services further."}
				</p>
			</header>

			{!isAdminView && (
				<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-5 shadow-xl backdrop-blur-md">
					<div className="flex gap-2 mb-4">
						<button
							onClick={() => setFeedbackFor("student")}
							className={`flex-1 px-3 py-2 rounded-lg border ${feedbackFor === "student" ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 border-amber-300/50" : "bg-slate-800/70 border-amber-200/20 text-amber-50"}`}
						>
							Student
						</button>
						<button
							onClick={() => setFeedbackFor("distributor")}
							className={`flex-1 px-3 py-2 rounded-lg border ${feedbackFor === "distributor" ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 border-amber-300/50" : "bg-slate-800/70 border-amber-200/20 text-amber-50"}`}
						>
							Distributor
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="grid sm:grid-cols-2 gap-3">
							<div>
								<label className="text-xs text-amber-100/70">Enrollment / ID</label>
								<input
									name="enrollment"
									value={form.enrollment}
									onChange={handleChange}
									required
									maxLength={10}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Name</label>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
						</div>

						<div className="grid sm:grid-cols-2 gap-3">
							<div>
								<label className="text-xs text-amber-100/70">Feedback type</label>
								<select
									name="feedbackType"
									value={form.feedbackType}
									onChange={handleChange}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								>
									<option>Delivery</option>
									<option>Stock</option>
									<option>Experience</option>
									<option>Complaint</option>
									<option>Suggestion</option>
								</select>
							</div>
							<div>
								<label className="text-xs text-amber-100/70">Contact</label>
								<input
									name="contact"
									value={form.contact}
									onChange={handleChange}
									placeholder="+91-98765-43210"
									maxLength={10}
									className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
								/>
							</div>
						</div>

						<div>
							<label className="text-xs text-amber-100/70">Feedback</label>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								required
								rows={4}
								className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
							/>
							<p className="text-xs text-amber-100/60 mt-1">
								Your Feedback is shared with RCs & Headquarters; Distributor submissions also reach RC approval queues.
							</p>
						</div>

						<button
							type="submit"
							className="w-full mt-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition flex items-center justify-center gap-2"
						>
							<Send className="w-4 h-4" />
							Submit feedback
						</button>
						{submitted && (
							<p className="text-sm text-amber-200 text-center">
								Thank you! Your feedback has been queued for review.
							</p>
						)}
					</form>
				</section>
			)}

			{isAdminView && (
				<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
					<div className="flex items-center justify-between flex-wrap gap-3">
						<div>
							<p className="text-xs text-amber-100/70">Incoming feedbacks</p>
							<h2 className="text-xl font-semibold text-amber-100">Review & triage</h2>
						</div>
						<div className="flex flex-wrap gap-2 text-xs">
							<select
								value={senderFilter}
								onChange={(e) => setSenderFilter(e.target.value as any)}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50"
							>
								<option value="all">All senders</option>
								<option value="student">Student</option>
								<option value="distributor">Distributor</option>
							</select>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50"
							>
								<option value="all">All types</option>
								<option value="Delivery">Delivery</option>
								<option value="Stock">Stock</option>
								<option value="Experience">Experience</option>
								<option value="Complaint">Complaint</option>
								<option value="Suggestion">Suggestion</option>
							</select>
							<input
								type="date"
								value={dateFilter}
								onChange={(e) => setDateFilter(e.target.value)}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50"
							/>
							<button
								onClick={() => {
									setSenderFilter("all");
									setTypeFilter("all");
									setDateFilter("");
								}}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30"
							>
								Reset
							</button>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 gap-3">
						{(inbox || []).map((fb) => (
							<div key={fb.id} className="rounded-xl bg-slate-800/70 border border-amber-200/10 p-3 space-y-2">
								<div className="flex items-center justify-between text-xs text-amber-100/70">
									<span className="capitalize">{fb.sender}</span>
									<span>{fb.date}</span>
								</div>
								<p className="text-sm font-semibold text-amber-100">{fb.feedbackType}</p>
								<p className="text-sm text-amber-100/80">{fb.message}</p>
								<p className="text-xs text-amber-100/60">
									By: {fb.name}
									{fb.enrollment ? ` (${fb.enrollment})` : ""}
								</p>
							</div>
						))}
						{(!inbox || inbox.length === 0) && (
							<p className="text-sm text-amber-100/70">No feedback matches the selected filters.</p>
						)}
					</div>
				</section>
			)}
		</div>
	);
};

export default FeedbackPage;
