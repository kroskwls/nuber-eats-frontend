import React from "react";

interface IButtonProps {
	canClick: boolean;
	loading: boolean;
	actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
	return (
		<button
			className={`text-white py-4 text-lg font-semibold transition-colors focus:outline-none
				${canClick ? 'bg-lime-500 hover:bg-lime-700' : 'bg-gray-300 pointer-events-none'}
			`}
		>{loading ? 'loading...' : actionText}</button>
	);
}