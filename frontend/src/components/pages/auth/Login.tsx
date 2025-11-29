import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import AuthCard from "../../ui/AuthCard";
import { loginUser } from "../../../store/authSlice";
import type { AppDispatch, RootState } from "../../../store/store";

const Login: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { user, loading, error } = useSelector((state: RootState) => state.auth);
	const [form, setForm] = useState({ email: "", password: "" });

	useEffect(() => {
		if (user?.role === "ADMIN") navigate("/admin");
		if (user?.role === "STUDENT") navigate("/student");
	}, [user, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUser(form));
	};

	return (
		<AuthCard title="Welcome Back">
			<form onSubmit={handleSubmit} className="space-y-3">
				<Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
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
					Login
				</Button>
			</form>
			<p className="text-sm text-center mt-4 text-amber-100/80">
				Don't have an account?{" "}
				<Link to="/register" className="text-amber-300 hover:text-amber-200 underline underline-offset-4">
					Register
				</Link>
			</p>
		</AuthCard>
	);
};

export default Login;
