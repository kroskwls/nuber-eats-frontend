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
			<div className='flex justify-between'>
				<div>
					<div className='h-4/5'>
						<h3 className='mb-2 text-lg font-semibold flex'>
							{name}
							{orderStarted && 
								<button className={`ml-3 py-1 px-3 focus:outline-none text-sm text-white ${isSelected ? 'bg-red-500' : 'bg-lime-500'}`} onClick={onClickDish}>
									{isSelected ? 'Remove' : 'Add'}
								</button>
							}
						</h3>
						<h4 className='text-sm font-medium'>{description}</h4>
					</div>
					<span className='text-sm h-1/5'>${price}</span>
				</div>
				<div className='p-16 ml-3' style={{ backgroundImage: `url(${photo})`, backgroundSize: '100% 100%' }} />
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