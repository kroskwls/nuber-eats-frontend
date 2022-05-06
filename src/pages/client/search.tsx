import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination } from '../../components/pagination';
import { Restaurant } from '../../components/restaurant';
import { SEARCH_RESTAURANTS_QUERY } from '../../graphql/queries';
import { SearchRestaurants, SearchRestaurantsVariables } from '../../__generated__/SearchRestaurants';

export const Search = () => {
	const [page, setPage] = useState(1);
	const onPrevPageClick = () => setPage(current => current - 1);
	const onNextPageClick = () => setPage(current => current + 1);
	const location = useLocation();
	const history = useHistory();
	const [searchQuery, { loading, data }] = useLazyQuery<
		SearchRestaurants, SearchRestaurantsVariables
	>(SEARCH_RESTAURANTS_QUERY);

	useEffect(() => {
		const query = location.search.split('term=')[1];
		if (!query) {
			return history.replace('/');
		}

		searchQuery({
			variables: {
				input: {
					page: 1,
					query,
				}
			}
		});
	}, [history, location, searchQuery]);

	return (
		<div className='container mt-5 flex-col'>
			<Helmet>
				<title>Search | Nuber Eats</title>
			</Helmet>
			<div className='flex items-center mb-5 bg-gray-200 w-fit py-3 px-8'>
				<h1 className='font-semibold text-3xl'>
					Search term: {location.search.split('term=')[1]}
				</h1>
			</div>
			{loading ? (
				<div
					className='mt-56 font-semibold text-3xl text-center'
				>loading...</div>
			) : (
				<>
					<div className='grid md:grid-cols-3 gap-x-5 gap-y-10'>
						{data?.searchRestaurants.restaurants?.map(restaurant => (
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
						totalPages={data?.searchRestaurants.totalPages}
						onNextPageClick={onNextPageClick}
						onPrevPageClick={onPrevPageClick}
					/>
				</>
			)}
		</div>
	);
}