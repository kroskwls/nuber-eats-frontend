import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Pagination } from '../pagination';

const mockGoBack = jest.fn();
jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useHistory: () => {
			return {
				goBack: mockGoBack
			};
		}
	}
});

describe('<pagination />', () => {
	const props = {
		page: 0,
		totalPages: 0,
		onPrevPageClick: jest.fn(),
		onNextPageClick: jest.fn()
	};

	it('render OK', () => {
		render(<Pagination {...props} />);
	});

	it('should be called before page function', async () => {
		render(<Pagination {...props} />);

		const backBtn = screen.getByText('Go back.');
		await waitFor(async () => {
			await userEvent.click(backBtn);
		});
		expect(mockGoBack).toHaveBeenCalledTimes(1);
	});

	it('should be called prev & next function', async () => {
		props.page = 2;
		props.totalPages = 3;
		render(<Pagination {...props} />);
		
		const nextBtn = screen.getByText('→');
		await waitFor(async () => {
			await userEvent.click(nextBtn);
		});
		expect(props.onNextPageClick).toHaveBeenCalledTimes(1);
		
		const prevBtn = screen.getByText('←');
		await waitFor(async () => {
			await userEvent.click(prevBtn);
		});
		expect(props.onPrevPageClick).toHaveBeenCalledTimes(1);
	});
});

afterAll(() => {
	jest.clearAllMocks();
});