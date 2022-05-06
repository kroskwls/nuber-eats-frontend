import { render, screen } from '@testing-library/react';
import React from 'react';
import { Restaurant } from '../restaurant';
import { BrowserRouter } from 'react-router-dom';

describe('<Restaurant />', () => {
	it('renders OK with props', () => {
		const props = {
			id: 1,
			coverImage: 'image',
			name: 'nameTest',
			categoryName: 'categoryTest'
		}
		render(
			<BrowserRouter>
				<Restaurant {...props} />
			</BrowserRouter>
		);
		screen.getByText(props.name);
		screen.getByText(props.categoryName);
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', `/restaurant/${props.id}`);
	});
});