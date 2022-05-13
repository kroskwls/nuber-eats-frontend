import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { EDIT_ORDER_MUTATION } from '../graphql/mutations';
import { GET_ONE_ORDER_QUERY } from '../graphql/queries';
import { ORDER_SUBSCRIPTION } from '../graphql/subscriptions';
import { useMe } from '../hooks/useMe';
import { EditOrderMutation, EditOrderMutationVariables } from '../__generated__/EditOrderMutation';
import { GetOneOrderQuery, GetOneOrderQueryVariables } from '../__generated__/GetOneOrderQuery';
import { OrderStatus, UserRole } from '../__generated__/globalTypes';
import { OrderUpdatesSubscription } from '../__generated__/OrderUpdatesSubscription';

interface IParams {
	id: string;
}

export const Order = () => {
	const { id: orderId } = useParams<IParams>();
	const { data: userData } = useMe();
	const { data, subscribeToMore } = useQuery<
		GetOneOrderQuery,
		GetOneOrderQueryVariables
	>(GET_ONE_ORDER_QUERY, {
		variables: {
			input: {
				id: +orderId
			}
		}
	});
	const [editOrderMutation] = useMutation<
		EditOrderMutation,
		EditOrderMutationVariables
	>(EDIT_ORDER_MUTATION, {
		onCompleted: ({ editOrder: { ok } }) => {
			if (ok) {

			}
		}
	});
	const onClickButton = (status: OrderStatus) => {
		editOrderMutation({
			variables: {
				input: {
					id: +orderId,
					status
				}
			}
		});
	};
	useEffect(() => {
		if (data?.getOneOrder.ok) {
			subscribeToMore({
				document: ORDER_SUBSCRIPTION,
				variables: {
					input: {
						id: +orderId
					}
				},
				updateQuery: (prev, { subscriptionData: { data } }: { subscriptionData: { data: OrderUpdatesSubscription } }) => {
					if (!data) {
						return prev;
					}
					return {
						getOneOrder: {
							...prev.getOneOrder,
							order: {
								...data.orderUpdates
							}
						}
					};
				}
			});
		}
	}, [data, orderId, subscribeToMore]);
	console.log(data);

	return (
		<div className='container-wrapper py-5 sm:py-32'>
			<Helmet>
				<title>Order #{orderId} | Nuber Eats</title>
			</Helmet>
			<div className='flex flex-col items-center'>
				<div className='border border-gray-800 w-full max-w-screen-sm mb-10'>
					<h4 className='bg-gray-800 w-full py-5 text-white text-center text-xl'>
						Order #{orderId}
					</h4>
					<h5 className='text-center py-10 text-3xl'>
						${data?.getOneOrder.order?.total?.toFixed(2)}
					</h5>
					<div className='px-5 text-xl grid gap-6'>
						<div className='border-t pt-5 border-gray-700'>
							Prepared By:
							<span className='font-semibold ml-3'>
								{data?.getOneOrder.order?.restaurant?.name}
							</span>
						</div>
						<div className='border-t pt-5 border-gray-700'>
							Deliver To:
							<span className='font-semibold ml-3'>
								{data?.getOneOrder.order?.customer?.email}
							</span>
						</div>
						<div className='border-t py-5 border-gray-700 border-b mb-5'>
							Driver:
							<span className='font-semibold ml-3'>
								{data?.getOneOrder.order?.driver?.email ?? 'Not yet.'}
							</span>
						</div>
					</div>
					{userData?.me.role === UserRole.Client && (
						<h5 className='text-center pt-5 pb-10 text-2xl text-lime-600'>
							Status: {data?.getOneOrder.order?.status}
						</h5>
					)}
					{userData?.me.role === UserRole.Owner && (
						<div className='px-5 pb-5'>
							{data?.getOneOrder.order?.status === OrderStatus.Pending && (
								<button
									onClick={() => onClickButton(OrderStatus.Cooking)}
									className='btn px-5 w-full'
								>Accept Order</button>
							)}
							{data?.getOneOrder.order?.status === OrderStatus.Cooking && (
								<button
									onClick={() => onClickButton(OrderStatus.Cooked)}
									className='btn px-5 w-full'
								>Order Cooked</button>
							)}
							{data?.getOneOrder.order?.status !== OrderStatus.Pending &&
								data?.getOneOrder.order?.status !== OrderStatus.Cooking && (
									<h5 className='text-center py-10 text-2xl text-lime-600'>
										Status: {data?.getOneOrder.order?.status}
									</h5>
								)}
						</div>
					)}
					{userData?.me.role === UserRole.Delivery && (
						<div className='px-5 pb-5'>
							{data?.getOneOrder.order?.status === OrderStatus.Cooked && (
								<button
									onClick={() => onClickButton(OrderStatus.PickedUp)}
									className='btn px-5 w-full'
								>Picked Up</button>
							)}
							{data?.getOneOrder.order?.status === OrderStatus.PickedUp && (
								<button
									onClick={() => onClickButton(OrderStatus.Delivered)}
									className='btn px-5 w-full'
								>Order Delivered</button>
							)}
							{data?.getOneOrder.order?.status === OrderStatus.Delivered && (
								<h5 className='text-center py-10 text-2xl text-lime-600'>
									Status: {data?.getOneOrder.order?.status}
								</h5>
							)}
						</div>
					)}
					{data?.getOneOrder.order?.status === OrderStatus.Delivered && (
						<h5 className='text-center pb-10 text-2xl text-lime-600'>
							Thank you for using Nuber Eats.
						</h5>
					)}
				</div>
				<div className='border border-gray-800 w-full max-w-screen-sm'>
					<h4 className='bg-gray-800 w-full py-5 text-white text-center text-xl'>
						Order #{orderId} Detail
					</h4>
					<div className='p-5 grid gap-6'>
						{data?.getOneOrder.order?.items.map(item => (
							<div className='border-b border-black pb-6'>
								<div className='flex'>
									<div className='p-14 bg-black bg-cover bg-center' style={{ backgroundImage: `url(${item.dish.photo})` }} />
									<div className='ml-5'>
										<h5 className='text-xl'>{item.dish.name}</h5>
										<h6 className='indent-5 text-sm text-gray-500'>
											{item.options?.map(option => (
												<div>
													{option.name} {option.choice}
												</div>
											))}
										</h6>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className='text-3xl px-5 pb-5 flex justify-between'>
						<h4>Total price</h4>
						<h4>${data?.getOneOrder.order?.total?.toFixed(2)}</h4>
					</div>
				</div>
			</div>
		</div>
	);
}