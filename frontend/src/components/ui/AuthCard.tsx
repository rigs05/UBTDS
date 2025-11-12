import React from "react";

interface AuthCardProps {
	title: string;
	children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
			<div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
					{title}
				</h2>
				{children}
			</div>
		</div>
	);
};

export default AuthCard;
