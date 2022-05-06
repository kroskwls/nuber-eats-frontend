import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Pagination } from '../../components/pagination';
import { Restaurant } from '../../components/restaurant';
import { ALL_RESTAURANT_QUERY } from '../../graphql/queries';
import { RestaurantsPageQuery, RestaurantsPageQueryVariables } from '../../__generated__/RestaurantsPageQuery';

interface IForm {
	searchTerm: string;
}

export const Restaurants = () => {
	const history = useHistory();
	const [page, setPage] = useState(1);
	const { data, loading } = useQuery<
		RestaurantsPageQuery, RestaurantsPageQueryVariables
	>(ALL_RESTAURANT_QUERY, {
		variables: {
			input: { page }
		}
	});
	const onPrevPageClick = () => setPage(current => current - 1);
	const onNextPageClick = () => setPage(current => current + 1);
	const { register, handleSubmit, getValues } = useForm<IForm>();
	const onSearchSubmit = () => {
		const { searchTerm } = getValues();
		history.push({
			pathname: '/search',
			search: `?term=${searchTerm}`
		});
	};

	return (
		<div>
			<Helmet>
				<title>Home | Nuber Eats</title>
			</Helmet>
			<form
				className='bg-gray-800 w-full py-40 flex items-center justify-center'
				onSubmit={handleSubmit(onSearchSubmit)}
			>
				<input
					className='input w-3/4 md:w-4/12 max-w-xl rounded-md border-0'
					type="search" placeholder='Search restaurants...'
					{...register('searchTerm', {
						required: true
					})}
				/>
			</form>
			{!loading && (
				<div className='container mt-8 pb-20'>
					<div className='flex justify-around min-w-fit mx-auto'>
						{data?.allCategories.categories?.map(category => (
							<Link key={category.id} to={`/category/${category.slug}`}>
								<div className='flex flex-col items-center group cursor-pointer'>
									<div
										className='w-14 h-14 rounded-full bg-cover bg-center group-hover:bg-gray-200'
										style={{ backgroundImage: `url(${category.icon})` }}
									></div>
									<span
										className='text-xs text-center mt-2 font-semibold '
									>{category.name}</span>
								</div>
							</Link>
						))}
					</div>
					<div className='grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16'>
						{data?.restaurants.results?.map(restaurant => (
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
						totalPages={data?.restaurants.totalPages}
						onNextPageClick={onNextPageClick}
						onPrevPageClick={onPrevPageClick}
					/>
				</div>
			)}
		</div>
	);
};