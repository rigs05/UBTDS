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
		"w-full py-2.5 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
	const styles =
		variant === "primary"
			? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/25"
			: "bg-slate-800 text-amber-50 border border-amber-200/20 hover:bg-slate-700";

	return (
		<button {...props} disabled={loading} className={`${base} ${styles}`}>
			{loading ? "Processing..." : children}
		</button>
	);
};

export default Button;
