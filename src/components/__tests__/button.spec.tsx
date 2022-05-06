import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '../button';

describe('<Button />', () => {
	it('should render OK with props', () => {
		render(
			<Button canClick={true} loading={false} actionText='test' />
		);
		screen.getByText('test');
	});

	it('should display loading', () => {
		render(
			<Button canClick={false} loading={true} actionText='test' />
		);
		const button = screen.getByText('loading...');
		expect(button).toHaveClass('pointer-events-none');
		expect(button).toHaveClass('bg-gray-300');
	});
});