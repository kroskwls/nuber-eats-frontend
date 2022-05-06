import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { CATEGORY_QUERY } from '../../graphql/queries';
import { CategoryQuery, CategoryQueryVariables } from '../../__generated__/CategoryQuery';
import { Restaurant } from '../../components/restaurant';
import { Pagination } from '../../components/pagination';

interface ICategoryParams {
	slug: string;
}

export const Category = () => {
	const [page, setPage] = useState(1);
	const onPrevPageClick = () => setPage(current => current - 1);
	const onNextPageClick = () => setPage(current => current + 1);
	const { slug } = useParams<ICategoryParams>();
	const { data, loading } = useQuery<
		CategoryQuery, CategoryQueryVariables
	>(CATEGORY_QUERY, {
		variables: {
			input: { page, slug }
		}
	});

	return (
		<div className='container mt-5'>
			<Helmet>
				<title>Category | Nuber Eats</title>
			</Helmet>
			<div className='flex items-center mb-5 bg-gray-200 w-fit pl-5'>
				<h1 className='font-semibold text-3xl mr-5'>
					{data?.categories.category?.name}
				</h1>
				<div
					className='p-10 bg-cover bg-center'
					style={{ backgroundImage: `url(${data?.categories.category?.icon})` }}
				></div>
			</div>
			{loading ? (
				<div
					className='mt-56 font-semibold text-3xl text-center'
				>loading...</div>
			) : (
				<>
					<div className='grid md:grid-cols-3 gap-x-5 gap-y-10'>
						{data?.categories.results?.map(restaurant => (
							<Restaurant
								key={restaurant.id}
								id={restaurant.id}
								coverImage={restaurant.coverImage}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
					<Pagination
						page={page}
						totalPages={data?.categories.totalPages}
						onNextPageClick={onNextPageClick}
						onPrevPageClick={onPrevPageClick}
					/>
				</>
			)}
		</div>
	);
}