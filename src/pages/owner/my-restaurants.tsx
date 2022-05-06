import { useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { MY_RESTAURANTS_QUERY } from '../../graphql/queries';
import { MyRestaurantsQuery } from '../../__generated__/MyRestaurantsQuery';

export const MyRestaurants = () => {
	const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
	return (
		<div className='container-wrapper'>
			<Helmet>
				<title>My Restaurants | Nuber Eats</title>
			</Helmet>
			<div className='container mt-32'>
				<h2 className='text-4xl font-medium mb-10'>My Restaurants</h2>
				<Link
					className='mr-8 text-white bg-gray-800 py-3 px-10'
					to='/add-restaurant'
				>Create Restaurant →</Link>
				{data?.myRestaurants.ok && data.myRestaurants.restaurants?.length === 0 ? (
					<>
						<h4 className=''>You have no restaurants.</h4>
					</>
				) : (
					<div className='grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16'>
						{data?.myRestaurants.restaurants?.map(restaurant => (
							<Restaurant
								key={restaurant.id}
								id={restaurant.id}
								coverImage={restaurant.coverImage}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}