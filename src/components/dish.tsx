import React from 'react';
import { OneRestaurantQuery_restaurant_restaurant_menu_options } from '../__generated__/OneRestaurantQuery';

interface IDishProps {
	id?: number;
	name: string;
	price: number;
	description: string;
	photo: string | null;
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
			<div className='grid gap-3'>
				<div className='flex justify-between'>
					<h3 className='text-lg font-semibold title-overflow' title={name}>{name}</h3>
					{orderStarted &&
						<button className={`px-7 ml-3 focus:outline-none text-sm text-white ${isSelected ? 'bg-red-500' : 'bg-lime-500'}`} onClick={onClickDish}>
							{isSelected ? 'Remove' : 'Add'}
						</button>
					}
				</div>
				<div className='flex bg-lime-300 py-32 bg-cover bg-center' style={{ backgroundImage: `url(${photo})` }} />
				<h4 className='text-sm font-medium' title={description}>{description}</h4>
				<p className='text-sm'>${price}</p>
			</div>
			{options && options?.length !== 0 &&
				<div>
					<h5 className='mt-5 mb-3 font-semibold'>Dish Options:</h5>
					<div className='grid gap-2 justify-start'>{dishOptions}</div>
				</div>
			}
		</div>
	)
};