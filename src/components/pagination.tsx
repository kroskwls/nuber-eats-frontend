import React from 'react';
import { useHistory } from 'react-router-dom';

interface IPaginationProps {
	page: number;
	totalPages?: number | null;
	onPrevPageClick: Function;
	onNextPageClick: Function;
}

export const Pagination: React.FC<IPaginationProps> = ({ page, totalPages, onPrevPageClick, onNextPageClick }) => {
	const history = useHistory();

	return (
		<div>
			{(totalPages != null && totalPages > 0) ? (
				<div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
					{page !== 1 ? (
						<button
							className='font-semibold text-2xl focus:outline-none'
							onClick={() => onPrevPageClick()}
						>&larr;</button>
					) : <div></div>}
					<span>
						Page {page} of {totalPages}
					</span>
					{page < totalPages ? (
						<button
							className='font-semibold text-2xl focus:outline-none'
							onClick={() => onNextPageClick()}
						>&rarr;</button>
					) : <div></div>}
				</div>
			) : (
				<div className='flex flex-col mt-5 text-xl'>
					<div className='font-semibold'>
						Could not found restaurants in this category.
					</div>
					<p
						className='link cursor-pointer mx-auto'
						onClick={() => history.goBack()}
					>Go back.</p>
				</div>
			)}
		</div>
	);
}