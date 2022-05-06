import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ONE_RESTAURANT_QUERY } from '../../../graphql/queries';
import { render } from '../../../test-utils';
import { RestaurantDetail } from '../../client/restaurant';

jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useParams: () => {
			return {
				id: '1'
			}
		}
	};
});

describe('<RestaurantDetail />', () => {
	const restuarantName = 'restaurant-name';
	const restaurantAddress = 'restaurant-address';
	const mocks = [{
		request: {
			query: ONE_RESTAURANT_QUERY,
			variables: {
				input: {
					restaurantId: 1
				}
			}
		},
		result: {
			data: {
				restaurant: {
					ok: true,
					error: 'query-error',
					restaurant: {
						__typename: "Restaurant",
						id: 1,
						name: restuarantName,
						coverImage: 'restaurant-cover-image-url',
						category: {
							id: 1,
							name: 'category-name',
							icon: 'icon-url',
							slug: 'category-slug',
							restaurantCount: 20
						},
						address: restaurantAddress,
						isPromoted: false,
					}
				}
			}
		}
	}];

	it('render OK with restaurant data', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<RestaurantDetail />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));

			screen.getAllByText(restuarantName);
			screen.getAllByText(restaurantAddress);
		});
	});
});