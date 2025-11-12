import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/ui/AuthCard";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/authSlice";

const Register: React.FC = () => {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		phone: "",
		address: "",
		isAdmin: false,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(registerUser(form));
	};

	return (
		<AuthCard title="Create an Account">
			<form onSubmit={handleSubmit}>
				<Input
					label="First Name"
					name="firstName"
					value={form.firstName}
					onChange={handleChange}
				/>
				<Input
					label="Last Name"
					name="lastName"
					value={form.lastName}
					onChange={handleChange}
				/>
				<Input
					label="Email"
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
				/>
				<Input
					label="Phone"
					name="phone"
					value={form.phone}
					onChange={handleChange}
				/>
				<Input
					label="Address"
					name="address"
					value={form.address}
					onChange={handleChange}
				/>
				<Input
					label="Password"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
				/>

				<div className="flex items-center mb-4">
					<input
						type="checkbox"
						name="isAdmin"
						checked={form.isAdmin}
						onChange={handleChange}
						className="mr-2"
					/>
					<label className="text-sm text-gray-700">Register as Admin</label>
				</div>

				<Button type="submit">Register</Button>
			</form>
			<p className="text-sm text-center mt-4 text-gray-600">
				Already have an account?{" "}
				<a href="/login" className="text-indigo-600 hover:underline">
					Login
				</a>
			</p>
		</AuthCard>
	);
};

export default Register;
