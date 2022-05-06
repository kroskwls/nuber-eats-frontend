import React from 'react';
import { OneRestaurantQuery_restaurant_restaurant_menu_options_choices } from '../__generated__/OneRestaurantQuery';

interface IDishOptionProps {
	isOptionSelected: boolean;
	isOptionChoiceSelected: (dishId: number, name: string, choiceName: string) => boolean;
	addOptionToItem: (dishId: number, name: string, choiceName?: string) => void;
	name: string;
	extra: number | null;
	dishId: number;
	choices: OneRestaurantQuery_restaurant_restaurant_menu_options_choices[] | null;
}

export const DishOption: React.FC<IDishOptionProps> = ({
	isOptionSelected,
	isOptionChoiceSelected,
	addOptionToItem,
	dishId,
	name,
	extra,
	choices
}) => {
	return (
		<div>
			<span
				className={`px-2 py-1 ${choices?.length === 0 ? 'border hover:cursor-pointer' : ''} ${isOptionSelected ? 'border-gray-800' : ''}`}
				onClick={() => choices?.length === 0 && addOptionToItem(dishId, name)}
			>
				<span className='mr-2'>{name}</span>
				{extra !== 0 && <span className='text-sm opacity-75'>(${extra})</span>}
			</span>
			<div className='text-sm grid gap-1 justify-start'>
				{choices?.length !== 0 &&
					choices?.map((choice, cIdx) => (
						<div key={cIdx} 
							className={`border px-2 py-1 ml-6 ${isOptionChoiceSelected(dishId, name, choice.name) ? 'border-gray-800' : 'hover:cursor-pointer'}`}
							onClick={() => addOptionToItem(dishId, name, choice.name)}
						>
							<span className='mr-2'>{choice.name}</span>
							<span className='text-sm opacity-75'>(${choice.extra})</span>
						</div>
					))
				}
			</div>
		</div>
	);
};