import { ApolloProvider } from '@apollo/client';
import { screen, waitFor } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';
import React from 'react';
import routerData from 'react-router-dom';
import { render } from '../../../test-utils';
import { Search } from '../../client/search';

const mockReplace = jest.fn();
const restaurantName = 'restaurant-name';
const mockSearchQuery = jest.fn();
jest.mock('@apollo/client', () => {
	const realModule = jest.requireActual('@apollo/client');
	return {
		...realModule,
		useLazyQuery: () => {
			return [
				mockSearchQuery,
				{
					data: {
						searchRestaurants: {
							ok: true,
							error: 'search-error',
							totalPages: 3,
							totalResults: 10,
							restaurants: [{
								__typename: "Restaurant",
								id: 1,
								name: restaurantName,
								coverImage: 'image-url',
								category: {
									__typename: "Category",
									name: 'category-name',
									slug: 'slug'
								},
								address: 'restaurant-address',
								isPromoted: false,
							}]
						}
					},
					loading: false
				}
			];
		}
	}
});

const searchTerm = 'searchTerm';
jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useLocation: () => {
			return {
				search: `url?term=${searchTerm}`
			};
		},
		useHistory: () => {
			return {
				replace: mockReplace
			};
		}
	};
});

describe('<Search />', () => {
	let mockedClient = createMockClient();
	const setup = () => {
		render(
			<ApolloProvider client={mockedClient}>
				<Search />
			</ApolloProvider>
		);
	};

	it('render OK with search term', async () => {
		setup();

		await waitFor(() => {
			expect(document.title).toBe('Search | Nuber Eats');
		});
		
		screen.getByText(`Search term: ${searchTerm}`);
		screen.getByText(restaurantName);
		expect(mockSearchQuery).toHaveBeenCalledTimes(1);
		expect(mockSearchQuery).toHaveBeenCalledWith({
			variables: {
				input: {
					page: 1,
					query: searchTerm,
				}
			}
		});
	});

	it('should go home, if do not contain search term', async () => {
		jest.spyOn(routerData, 'useLocation').mockReturnValue({
			pathname: '',
			hash: '',
			search: '',
			state: ''
		});

		setup();

		expect(mockReplace).toHaveBeenCalledTimes(1);
		expect(mockReplace).toHaveBeenCalledWith('/');
	});
});