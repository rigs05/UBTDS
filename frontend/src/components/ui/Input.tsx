import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    </div>
  );
};

export default Input;
