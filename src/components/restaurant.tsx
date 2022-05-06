import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
	id: number;
	coverImage: string;
	name: string;
	categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ id, coverImage, name, categoryName }) => {
	return (
		<Link to={`/restaurant/${id}`}>
			<div className='flex flex-col'>
				<div
					className='bg-cover bg-center py-28 mb-3'
					style={{ backgroundImage: `url(${coverImage})` }}
				></div>
				<h3
					className='text-xl font-medium'
				>{name}</h3>
				<span
					className='text-xs border-t py-1 mt-1 border-gray-400 opacity-80'
				>{categoryName}</span>
			</div>
		</Link>
	);
}