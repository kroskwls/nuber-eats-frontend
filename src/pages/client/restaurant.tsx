import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DishOption } from '../../components/dish-option';
import { CREATE_ORDER_MUTATION } from '../../graphql/mutations';
import { ONE_RESTAURANT_QUERY } from '../../graphql/queries';
import { CreateOrderMutation, CreateOrderMutationVariables } from '../../__generated__/CreateOrderMutation';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { OneRestaurantQuery, OneRestaurantQueryVariables } from '../../__generated__/OneRestaurantQuery';

interface IRestaurantParams {
	id: string;
}

export const RestaurantDetail = () => {
	const history = useHistory();
	const { id } = useParams<IRestaurantParams>();
	const { data } = useQuery<
		OneRestaurantQuery, OneRestaurantQueryVariables
	>(ONE_RESTAURANT_QUERY, {
		variables: {
			input: { restaurantId: +id }
		}
	});
	const [totalPrice, setTotalPrice] = useState(0);
	const [orderStarted, setOrderStarted] = useState(false);
	const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
	const getDishInfo = (dishId: number) => {
		return data?.restaurant.restaurant?.menu?.find(dish => dish.id === dishId);
	};
	const updatePrice = (orderItems: CreateOrderItemInput[]) => {
		let total = 0;

		for (const item of orderItems) {
			const dishInfo = getDishInfo(item.dishId);
			const price = dishInfo?.price ?? 0;
			total += price;
			const options = item.options ?? [];
			for (const option of options) {
				const optionInfo = dishInfo?.options?.find(o => o.name === option.name);
				const optionExtra = optionInfo?.extra ?? 0;
				total += optionExtra;
				if (option.choice) {
					const choiceInfo = optionInfo?.choices?.find(choice => choice.name === option.choice);
					const choiceExtra = choiceInfo?.extra ?? 0;
					total += choiceExtra;
				}
			}
		}

		setTotalPrice(+total.toFixed(2));
	};
	const triggerStartOrder = () => {
		setOrderStarted(true);
	};
	const getItem = (dishId: number) => {
		return orderItems.find(order => order.dishId === dishId);
	};
	const isSelected = (dishId: number) => {
		return Boolean(getItem(dishId));
	};
	const addItemToOrder = (dishId: number) => {
		if (isSelected(dishId)) {
			return;
		}
		setOrderItems(current => {
			const newOrderItems = [...current, { dishId, options: [] }];
			updatePrice(newOrderItems);
			return newOrderItems;
		});
	};
	const removeFromOrder = (dishId: number) => {
		setOrderItems(current => {
			const newOrderItems = current.filter(order => order.dishId !== dishId)
			updatePrice(newOrderItems);
			return newOrderItems;
		});
	};
	const getItemOption = (dishId: number, optionName: string) => {
		const item = getItem(dishId);
		if (!item) {
			return;
		}
		return item.options?.find(option => option.name === optionName);
	}
	const isOptionSelected = (dishId: number, optionName: string) => {
		return Boolean(getItemOption(dishId, optionName));
	};
	const removeOptionFromItem = (dishId: number, optionName: string) => {
		const item = getItem(dishId);
		if (!item) {
			return;
		}
		removeFromOrder(dishId);
		const options = item.options?.filter(option => option.name !== optionName);
		setOrderItems(current => {
			const newOrderItems = [...current, { dishId, options }];
			updatePrice(newOrderItems);
			return newOrderItems;
		});
	};
	const addOptionToItem = (dishId: number, optionName: string, choiceName?: string) => {
		const oldItem = getItem(dishId);
		if (!oldItem) {
			// item이 선택되지 않았으면 중지
			return;
		}
		if (isOptionSelected(dishId, optionName) && !choiceName) {
			// choice가 없는 option이 이미 선택된 경우 옵션 삭제
			removeOptionFromItem(dishId, optionName);
			return;
		}
		let oldOptions = oldItem.options ?? [];
		if (choiceName) {
			// choice가 있는 option인 경우 해당 option 삭제 처리
			oldOptions = oldOptions?.filter(oldOption => oldOption.name !== optionName);
		}
		removeFromOrder(dishId);
		const options = [...oldOptions];
		const oldOption = getItemOption(dishId, optionName);
		if (!oldOption?.choice || oldOption?.choice !== choiceName) {
			options.push({
				name: optionName,
				...(choiceName && { choice: choiceName })
			});
		}
		setOrderItems(current => {
			const newOrderItems = [...current, { dishId, options }];
			updatePrice(newOrderItems);
			return newOrderItems;
		});
	};
	const isOptionChoiceSelected = (dishId: number, optionName: string, choiceName: string) => {
		const option = getItemOption(dishId, optionName);
		return option?.choice === choiceName;
	};
	const triggerCancelOrder = () => {
		setOrderStarted(false);
		setOrderItems([]);
		setTotalPrice(0);
	};
	const [createOrderMutation, { loading: placingOrder }] = useMutation<
		CreateOrderMutation,
		CreateOrderMutationVariables
	>(CREATE_ORDER_MUTATION, {
		onCompleted: ({ createOrder: { ok, orderId } }: CreateOrderMutation) => {
			if (ok) {
				window.alert('Order Created!');
				history.push(`/orders/${orderId}`);
			}
		}
	});
	const triggerComfirmOrder = () => {
		if (placingOrder) {
			return;
		}
		if (orderItems.length === 0) {
			window.alert('Can\'t place empty order');
			return;
		}
		const ok = window.confirm('You are about to place an order');
		if (ok) {
			createOrderMutation({
				variables: {
					input: {
						restaurantId: +id,
						items: orderItems
					}
				}
			});
		}
	};

	return (
		<div>
			<Helmet>
				<title>Restaurant | Nuber Eats</title>
			</Helmet>
			<div
				className='w-full py-36 bg-cover bg-center'
				style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})` }}
			>
				<div className='bg-white w-fit py-4 pl-24 lg:pl-48 pr-20'>
					<h1 className='text-3xl mb-3'>
						{data?.restaurant.restaurant?.name}
					</h1>
					<h4 className='text-sm font-light'>
						<Link
							className='hover:underline'
							to={`/category/${data?.restaurant.restaurant?.category?.slug}`}
						>
							{data?.restaurant.restaurant?.category?.name}
						</Link>
					</h4>
					<h4 className='text-sm font-light'>
						{data?.restaurant.restaurant?.address}
					</h4>
				</div>
			</div>
			<div className='container pb-32 mt-20 flex flex-col items-end'>
				{!orderStarted && (
					<button className='btn px-10' onClick={triggerStartOrder}>
						Start Order
					</button>
				)}
				{orderStarted && (
					<div className='flex'>
						<button className='btn px-10 mr-3' onClick={triggerComfirmOrder}>
							Comfirm Order
						</button>
						<button className='btn-color-none px-10 bg-black' onClick={triggerCancelOrder}>
							Cancel Order
						</button>
					</div>
				)}
				<div className='mt-5 mr-10 text-3xl'>
					<span>Total : ${totalPrice}</span>
				</div>
				<div className='w-full grid lg:grid-cols-3 gap-x-5 gap-y-10 mt-10'>
					{data?.restaurant.restaurant?.menu?.filter(_ => true).sort((a, b) => a.id - b.id).map((dish, i) => (
						<Dish
							key={i}
							id={dish.id}
							name={dish.name}
							price={dish.price}
							description={dish.description}
							photo={dish.photo}
							options={dish.options}
							orderStarted={orderStarted}
							isSelected={isSelected(dish.id)}
							addItemToOrder={addItemToOrder}
							removeFromOrder={removeFromOrder}
						>
							{dish.options?.map((option, index) => (
								<DishOption
									key={index}
									isOptionSelected={isOptionSelected(dish.id, option.name)}
									isOptionChoiceSelected={isOptionChoiceSelected}
									addOptionToItem={addOptionToItem}
									dishId={dish.id}
									name={option.name}
									extra={option.extra}
									choices={option.choices}
								/>
							))}
						</Dish>
					))}
				</div>
			</div>
		</div>
	);
}