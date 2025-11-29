// Book catalog page with filters, cart summary, totals, and checkout.
import React, { useEffect, useMemo, useState } from "react";
import { Filter, ShoppingCart, SortAsc, SortDesc } from "lucide-react";
import axios from "axios";
import { bookCatalog as fallbackBooks, type BookItem } from "../../../data/mockData";
import toast from "react-hot-toast";

type SortKey = "title" | "course" | "isbn";

const BookCatalog: React.FC = () => {
	const [query, setQuery] = useState("");
	const [course, setCourse] = useState<string>("all");
	const [showUsed, setShowUsed] = useState<boolean | "all">("all");
	const [sortKey, setSortKey] = useState<SortKey>("title");
	const [sortAsc, setSortAsc] = useState(true);
	const [cart, setCart] = useState<Record<string, number>>({});
	const [books, setBooks] = useState<BookItem[]>(fallbackBooks);
	const [address, setAddress] = useState({
		line1: "",
		city: "",
		state: "",
		pincode: "",
	});
	const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const [profileRes, catalogRes] = await Promise.all([
					axios.get("/api/student/profile"),
					axios.get("/api/student/catalog").catch(() => ({ data: { books: fallbackBooks } })),
				]);
				const addr = profileRes.data.address || {};
				setBooks(catalogRes.data.books || fallbackBooks);
				setAddress({
					line1: addr.line1 || "",
					city: addr.city || "",
					state: addr.state || "",
					pincode: addr.pincode || "",
				});
			} catch {
				// silent fallback to defaults
			}
		};
		fetchProfile();
	}, []);

	const filtered = useMemo(() => {
		return books
			.filter((book) => {
				if (course !== "all" && book.course !== course) return false;
				if (showUsed !== "all" && book.isUsed !== showUsed) return false;
				if (!query.trim()) return true;
				const q = query.toLowerCase();
				return (
					book.title.toLowerCase().includes(q) ||
					book.code.toLowerCase().includes(q) ||
					book.isbn.toLowerCase().includes(q) ||
					book.course.toLowerCase().includes(q)
				);
			})
			.sort((a, b) => {
				const aVal = a[sortKey].toString().toLowerCase();
				const bVal = b[sortKey].toString().toLowerCase();
				return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			});
	}, [books, course, query, showUsed, sortAsc, sortKey]);

	const updateCart = (bookId: string, delta: number) => {
		setCart((prev) => {
			const next = { ...prev, [bookId]: (prev[bookId] || 0) + delta };
			if (next[bookId] <= 0) delete next[bookId];
			return next;
		});
	};

	const cartItems = useMemo(() => {
		return Object.entries(cart)
			.map(([id, qty]) => {
				const book = books.find((b) => b.id === id);
				return book ? { ...book, qty } : null;
			})
			.filter(Boolean) as Array<BookItem & { qty: number }>;
	}, [books, cart]);

	const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

	const handleCheckout = async () => {
		if (cartItems.length === 0) {
			setCheckoutMessage("Add at least one item to cart.");
			return;
		}
		const items = cartItems.map((item) => ({ code: item.code, title: item.title, qty: item.qty }));
		try {
			await axios.post("/api/student/orders/checkout", { items, address });
			setCheckoutMessage("Order placed. Admin approval in progress.");
			toast.success("Order placed. Admin approval in progress.");
			setCart({});
		} catch {
			setCheckoutMessage("Unable to place order right now.");
			toast.error("Unable to place order right now.");
		}
	};

	return (
		<div className="space-y-4 text-amber-50">
			<header className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex items-center justify-between flex-wrap gap-3">
				<div>
					<p className="text-xs text-amber-100/70">BCA • BCA_OL • MCA_NEW • MCA_OL</p>
					<h1 className="text-2xl font-semibold text-amber-100">Book & Material Catalog</h1>
					<p className="text-sm text-amber-100/70">
						New and used stock across HQ, RCs, and 25 stocked zones. Add quantities and build your cart.
					</p>
				</div>
				<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-amber-200/20">
					<ShoppingCart className="w-4 h-4 text-amber-300" />
					<span className="text-sm">Cart: {cartItems.reduce((a, b) => a + b.qty, 0)} items</span>
				</div>
			</header>

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md">
				<div className="grid md:grid-cols-4 gap-3">
					<div className="col-span-2">
						<label className="text-xs text-amber-100/70">Search (title, code, course, ISBN)</label>
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search BCS-011, Data Structures, MCA_OL..."
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">Course</label>
						<select
							value={course}
							onChange={(e) => setCourse(e.target.value)}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
						>
							<option value="all">All</option>
							<option value="BCA">BCA</option>
							<option value="BCA_OL">BCA_OL</option>
							<option value="MCA_NEW">MCA_NEW</option>
							<option value="MCA_OL">MCA_OL</option>
						</select>
					</div>
					<div className="flex items-end gap-2">
						<button
							onClick={() => setShowUsed(showUsed === "all" ? false : showUsed === false ? true : "all")}
							className="flex-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 flex items-center justify-between hover:border-amber-300/30 transition"
						>
							<span className="text-sm">
								{showUsed === "all" ? "All stock" : showUsed ? "Used/old only" : "New only"}
							</span>
							<Filter className="w-4 h-4 text-amber-300" />
						</button>
					</div>
				</div>
				<div className="mt-3 flex items-center gap-3">
					<label className="text-xs text-amber-100/70">Sort by</label>
					<select
						value={sortKey}
						onChange={(e) => setSortKey(e.target.value as SortKey)}
						className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
					>
						<option value="title">Name</option>
						<option value="course">Course</option>
						<option value="isbn">ISBN</option>
					</select>
					<button
						onClick={() => setSortAsc((prev) => !prev)}
						className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 flex items-center gap-2 hover:border-amber-300/30 transition"
					>
						{sortAsc ? <SortAsc className="w-4 h-4 text-amber-300" /> : <SortDesc className="w-4 h-4 text-amber-300" />}
						<span className="text-sm">{sortAsc ? "Asc" : "Desc"}</span>
					</button>
				</div>
			</section>

			<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
				{filtered.map((book) => (
					<div
						key={book.id}
						className="rounded-2xl bg-slate-900/80 border border-amber-200/15 shadow-xl backdrop-blur-md p-4 flex flex-col gap-3"
					>
						<div className="h-28 rounded-lg bg-slate-800/70 border border-amber-200/15 flex items-center justify-center text-amber-200 text-sm font-semibold">
							{book.title}
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-base font-semibold text-amber-100">{book.code}</p>
								<p className="text-xs text-amber-100/70">{book.title}</p>
								<p className="text-xs text-amber-100/70">Course: {book.course}</p>
							</div>
							<div className="text-right">
								<p className="text-lg font-semibold text-amber-200">₹{book.price}</p>
								<p className="text-xs text-amber-100/70">ISBN: {book.isbn}</p>
							</div>
						</div>
						<div className="flex items-center justify-between text-xs text-amber-100/70">
							<span className="px-2 py-1 rounded-full border border-amber-200/20 bg-slate-800/60">
								{book.isUsed ? `Used • ${book.condition}` : "New"}
							</span>
							<span className="text-amber-200">{book.stockZones.length} stocked zones</span>
						</div>
						<div className="grid grid-cols-3 gap-2 text-xs text-amber-100/70">
							{book.stockZones.slice(0, 3).map((zone) => (
								<span
									key={zone}
									className="px-2 py-1 rounded-lg bg-slate-800/70 border border-amber-200/15 text-center"
								>
									{zone}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => updateCart(book.id, -1)}
								className="px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 hover:border-amber-300/30 transition flex-1"
							>
								-
							</button>
							<div className="flex-1 text-center text-amber-100 font-semibold">Qty: {cart[book.id] ?? 0}</div>
							<button
								onClick={() => updateCart(book.id, 1)}
								className="px-3 py-2 rounded-lg bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition flex-1"
							>
								+
							</button>
						</div>
					</div>
				))}
			</section>

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<h2 className="text-lg font-semibold text-amber-100">Cart summary</h2>
					<span className="text-sm text-amber-100/80 font-semibold">Total: ₹{cartTotal.toFixed(2)}</span>
				</div>
				{cartItems.length === 0 ? (
					<p className="text-sm text-amber-100/70">No items in cart.</p>
				) : (
					<div className="space-y-2">
						{cartItems.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between rounded-lg border border-amber-200/10 bg-slate-800/60 p-3"
							>
								<div>
									<p className="text-sm font-semibold text-amber-100">{item.code} • {item.title}</p>
									<p className="text-xs text-amber-100/70">Qty: {item.qty}</p>
								</div>
								<p className="text-sm text-amber-200">₹{(item.price * item.qty).toFixed(2)}</p>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="bg-slate-900/80 border border-amber-200/15 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<h2 className="text-lg font-semibold text-amber-100">Checkout</h2>
					<span className="text-xs text-amber-100/70">Autofilled from your profile</span>
				</div>
				<div className="grid md:grid-cols-2 gap-3">
					<div>
						<label className="text-xs text-amber-100/70">Address</label>
						<input
							value={address.line1}
							onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">City</label>
						<input
							value={address.city}
							onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">State</label>
						<input
							value={address.state}
							onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
					<div>
						<label className="text-xs text-amber-100/70">Pincode</label>
						<input
							value={address.pincode}
							onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
							className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/70 border border-amber-200/20 text-amber-50 focus:ring-2 focus:ring-amber-400/50"
						/>
					</div>
				</div>
				<button
					onClick={handleCheckout}
					className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
				>
					Place order (₹{cartTotal.toFixed(2)})
				</button>
				{checkoutMessage && <p className="text-sm text-amber-100/80">{checkoutMessage}</p>}
			</section>
		</div>
	);
};

export default BookCatalog;
