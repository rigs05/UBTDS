// Registration form for students and admin invite flow.
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import AuthCard from "../../ui/AuthCard";
import { registerUser } from "../../../store/authSlice";
import type { AppDispatch, RootState } from "../../../store/store";

type FormRole = "STUDENT" | "ADMIN";

const Register: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { user, loading, error } = useSelector((state: RootState) => state.auth);
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		phone: "",
		address: "",
		enrollmentNo: "",
		role: "STUDENT" as FormRole,
	});

	const adminDisabled = useMemo(() => !user || user.role !== "ADMIN", [user]);

	useEffect(() => {
		if (!user) return;
		if (user.role === "STUDENT") {
			navigate("/student");
		} else if (user.role === "DISTRIBUTOR") {
			navigate("/distributor");
		}
		// Allow ADMIN / RC_ADMIN to stay on this page to register other admins.
	}, [user, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(registerUser(form)).unwrap();
			toast.success("Registration successful");
		} catch (err: any) {
			const msg = typeof err === "string" ? err : "Registration failed. Please try again.";
			toast.error(msg);
		}
	};

	const showStudentFields = form.role === "STUDENT";

	return (
		<AuthCard title="Create an Account">
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="flex gap-2">
					<div className="flex-1">
						<Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
					</div>
					<div className="flex-1">
						<Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex-1">
						<label className="mb-1 text-sm font-medium text-amber-100 block">Role</label>
						<select
							name="role"
							value={form.role}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-amber-200/20 rounded-lg bg-slate-900/60 text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/70 transition"
						>
							<option value="STUDENT">Student</option>
							<option value="ADMIN" disabled={adminDisabled}>
								Admin (admin session required)
							</option>
						</select>
						{adminDisabled && (
							<p className="text-xs text-amber-100/70 mt-1">
								Sign in as an admin first to invite another admin.
							</p>
						)}
					</div>
				</div>
				<Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
				<Input label="Phone" name="phone" value={form.phone} onChange={handleChange} maxLength={10} />
				<Input label="Address" name="address" value={form.address} onChange={handleChange} />
				{showStudentFields && (
					<Input
						label="Enrollment No."
						name="enrollmentNo"
						value={form.enrollmentNo}
						onChange={handleChange}
						placeholder="Optional but helps with records"
					/>
				)}
				<Input
					label="Password"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					required
				/>

				{error && <p className="text-sm text-red-400">{error}</p>}
				<Button type="submit" loading={loading}>
					Register
				</Button>
			</form>
			<p className="text-sm text-center mt-4 text-amber-100/80">
				Already have an account?{" "}
				<Link to="/login" className="text-amber-300 hover:text-amber-200 underline underline-offset-4">
					Login
				</Link>
			</p>
		</AuthCard>
	);
};

export default Register;
