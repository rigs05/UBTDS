import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
	return (
		<div className="flex flex-col w-full mb-3">
			{label && <label className="mb-1 text-sm font-medium text-amber-100">{label}</label>}
			<input
				{...props}
				className="w-full px-4 py-2.5 border border-amber-200/20 rounded-lg bg-slate-900/60 text-amber-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-300 shadow-inner transition"
			/>
		</div>
	);
};

export default Input;
