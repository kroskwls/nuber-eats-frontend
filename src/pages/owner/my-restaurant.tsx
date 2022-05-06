import { useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { MY_RESTAURANT_QUERY } from '../../graphql/queries';
import { MyRestaurantQuery, MyRestaurantQueryVariables } from '../../__generated__/MyRestaurantQuery';
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryVoronoiContainer } from 'victory';
import { PENDING_ORDER_SUBSCRIPTION } from '../../graphql/subscriptions';
import { PendingOrdersSubsciption } from '../../__generated__/PendingOrdersSubsciption';

interface IParams {
	id: string;
}
interface IChartData {
	x: string;
	y: number | null;
}

export const MyRestaurant = () => {
	const { id } = useParams<IParams>();
	const [chartData, setChartData] = useState<IChartData[]>([]);
	const { data, loading } = useQuery<
		MyRestaurantQuery, MyRestaurantQueryVariables
	>(MY_RESTAURANT_QUERY, {
		variables: {
			input: { id: +id }
		},
		onCompleted: ({ myRestaurant: { ok, restaurant } }) => {
			if (ok) {
				const data = restaurant?.orders?.map(order => ({
					x: order.createdAt,
					y: order.total
				}));
				setChartData(data ?? []);
			}
		}
	});
	const { data: subscriptionData } = useSubscription<PendingOrdersSubsciption>(PENDING_ORDER_SUBSCRIPTION);
	const history = useHistory();
	useEffect(() => {
		const id = subscriptionData?.pendingOrders.id;
		if (id) {
			history.push(`/orders/${id}`);
		}
	}, [subscriptionData, history]);
	
	return (
		<>
			{loading ? (
				<div className='flex flex-grow items-center justify-center text-2xl'>
					loading...
				</div>
			) : (
				<>
					<div
						className='py-28 bg-cover bg-center'
						style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage}` }}
					></div>
					<div className='container-wrapper'>
						<div className='container'>
							<h1
								className='text-3xl font-semibold my-10'
							>{data?.myRestaurant.restaurant?.name}</h1>
							<Link
								className='mr-8 text-white bg-gray-800 py-3 px-10'
								to={`/restaurant/${id}/add-dish`}
							>Add Dish →</Link>
							<Link
								className='text-white bg-lime-700 py-3 px-10'
								to='/buy-promotion'
							>Buy Promotion →</Link>
							<div className='mt-10'>
								{data?.myRestaurant.restaurant?.menu?.length === 0 ? (
									<h4 className='text-xl'>Please add a dish.</h4>
								) : (
									<div className='grid lg:grid-cols-3 gap-x-5 gap-y-10 mt-16'>
										{data?.myRestaurant.restaurant?.menu?.map((dish, i) => (
											<Dish
												key={i}
												name={dish.name}
												price={dish.price}
												description={dish.description}
												photo={dish.photo}
											/>
										))}
									</div>
								)}
							</div>
							{chartData.length > 0 &&
								<div className='my-20'>
									<h4 className='text-center text-2xl font-semibold'>Sales</h4>
									<div className=''>
										<VictoryChart
											width={window.innerWidth}
											height={500}
											domainPadding={50}
											containerComponent={<VictoryVoronoiContainer />}
										>
											<VictoryLine
												data={chartData}
												style={{
													data: {
														strokeWidth: 3
													}
												}}
												interpolation="step"
												labels={({ datum }) => `$${datum.y}`}
												labelComponent={<VictoryLabel
													style={{ fontSize: 17 }}
													renderInPortal
													dy={-20}
												/>}
											/>
											<VictoryAxis
												tickLabelComponent={<VictoryLabel renderInPortal />}
												style={{
													grid: { stroke: '#0000003b' },
													tickLabels: {
														fontSize: 17,
														angle: -45,
														padding: 45
													}
												}}
												tickFormat={tick => new Date(tick).toLocaleDateString('ko')}
											/>
										</VictoryChart>
									</div>
								</div>
							}
						</div>
					</div>
				</>
			)}
		</>
	);
}