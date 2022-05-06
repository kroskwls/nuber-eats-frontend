import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ALL_RESTAURANT_QUERY } from '../../../graphql/queries';
import { render } from '../../../test-utils';
import { Restaurants } from '../../client/restaurants';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useHistory: () => {
			return {
				push: mockPush
			}
		}
	};
});

describe('<Restaurants />', () => {
	const categoryName = 'category-name';
	const categorySlug = 'slug';
	const restaurantName = 'restaurant-name';
	const mocks = [{
		request: {
			query: ALL_RESTAURANT_QUERY,
			variables: {
				input: {
					page: 1
				}
			}
		},
		result: {
			data: {
				allCategories: {
					ok: true,
					error: 'categories-error',
					categories: [{
						__typename: "Category",
						id: 1,
						name: categoryName,
						icon: 'icon',
						slug: categorySlug,
						restaurantCount: 1,
					}]
				},
				restaurants: {
					ok: true,
					error: 'restaurants-error',
					totalPages: 3,
					totalResults: 10,
					results: [{
						__typename: "Restaurant",
						id: 1,
						name: restaurantName,
						coverImage: 'cover-image',
						category: {
							name: categoryName,
							slug: categorySlug,
						},
						address: 'restaurant-address',
						isPromoted: false,
					}]
				}
			}
		}
	}];

	it('render OK with categories and restaurants', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Restaurants />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
			expect(document.title).toBe('Home | Nuber Eats');

			screen.getAllByText(restaurantName);
			screen.getAllByText(categoryName);
		});
	});

	it('should route category page', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Restaurants />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
		});

		const links = screen.getAllByRole('link');
		expect(links[0]).toHaveAttribute('href', `/category/${categorySlug}`);
	});

	it('should route search page', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Restaurants />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
		});

		const searchTerm = 'searchTerm';
		const searchInput = screen.getByPlaceholderText('Search restaurants...');
		await waitFor(async () => {
			await userEvent.type(searchInput, `${searchTerm}{enter}`);
		});

		expect(mockPush).toHaveBeenCalledTimes(1);
		expect(mockPush).toHaveBeenCalledWith({
			pathname: '/search',
			search: `?term=${searchTerm}`
		});
	});
});