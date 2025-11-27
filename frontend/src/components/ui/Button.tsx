import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
	loading,
	variant = "primary",
	children,
	...props
}) => {
	const base =
		"w-full py-2 px-4 rounded-md font-medium transition disabled:opacity-50";
	const styles =
		variant === "primary"
			? "bg-indigo-600 text-white hover:bg-indigo-700"
			: "bg-gray-100 text-gray-800 hover:bg-gray-200";

	return (
		<button {...props} disabled={loading} className={`${base} ${styles}`}>
			{loading ? "Processing..." : children}
		</button>
	);
};

export default Button;
