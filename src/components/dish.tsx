import React from 'react';
import { OneRestaurantQuery_restaurant_restaurant_menu_options } from '../__generated__/OneRestaurantQuery';

interface IDishProps {
	id?: number;
	name: string;
	price: number;
	description: string;
	photo: string | null;
	isCustomer?: boolean;
	options?: OneRestaurantQuery_restaurant_restaurant_menu_options[] | null;
	orderStarted?: boolean;
	addItemToOrder?: (dishId: number) => void;
	removeFromOrder?: (dishId: number) => void;
	isSelected?: boolean;
}

export const Dish: React.FC<IDishProps> = ({
	id = 0,
	name,
	price,
	description,
	photo,
	isCustomer = false,
	options,
	orderStarted = false,
	isSelected,
	addItemToOrder,
	removeFromOrder,
	children: dishOptions,
}) => {
	const onClickDish = () => {
		if (!orderStarted) {
			return;
		}

		if (!isSelected) {
			addItemToOrder && addItemToOrder(id);
		} else {
			removeFromOrder && removeFromOrder(id);
		}
	};

	return (
		<div className={`p-3 border transition-all flex flex-col ${isSelected ? 'border-gray-800' : ''}`}>
			{orderStarted &&
				<button className={`w-32 py-2 mb-3 focus:outline-none text-sm text-white ${isSelected ? 'bg-red-500' : 'bg-lime-500'}`} onClick={onClickDish}>
					{isSelected ? 'Remove' : 'Add'}
				</button>
			}
			<div className='flex justify-between'>
				<div className='flex flex-col justify-between' style={{ width: 'calc(100% - 128px)' }}>
					<div className='flex flex-col'>
						<h3 className='mb-2 text-lg font-semibold truncate' title={name}>{name}</h3>
						<h4 className='text-sm font-medium line-overflow' title={description}>{description}</h4>
					</div>
					<p className='text-sm'>${price}</p>
				</div>
				<div className='w-32 h-32 ml-3 bg-lime-300' style={{ backgroundImage: `url(${photo})`, backgroundSize: '100% 100%' }} />
			</div>
			{isCustomer && options && options?.length !== 0 &&
				<div>
					<h5 className='mt-5 mb-3 font-semibold'>Dish Options:</h5>
					<div className='grid gap-2 justify-start'>{dishOptions}</div>
				</div>
			}
		</div>
	)
};