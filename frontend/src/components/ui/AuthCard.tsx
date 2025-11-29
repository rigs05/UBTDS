import React from "react";

interface AuthCardProps {
	title: string;
	children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-black px-4 py-8">
			<div className="relative bg-slate-900/80 border border-amber-200/20 shadow-2xl rounded-2xl p-8 w-full max-w-md backdrop-blur-lg">
				<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-amber-500/10 via-transparent to-amber-300/5 pointer-events-none" />
				<h2 className="text-3xl font-semibold text-center mb-6 text-amber-200 tracking-wide">
					{title}
				</h2>
				<div className="relative z-10 space-y-3">{children}</div>
			</div>
		</div>
	);
};

export default AuthCard;
