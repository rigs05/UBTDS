import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/ui/AuthCard";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice";

const Login: React.FC = () => {
	const dispatch = useDispatch();
	const [form, setForm] = useState({ email: "", password: "" });

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
			<form onSubmit={handleSubmit}>
				<Input
					label="Email"
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
				/>
				<Input
					label="Password"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
				/>
				<Button type="submit">Login</Button>
			</form>
			<p className="text-sm text-center mt-4 text-gray-600">
				Don’t have an account?{" "}
				<a href="/register" className="text-indigo-600 hover:underline">
					Register
				</a>
			</p>
		</AuthCard>
	);
};

export default Login;
