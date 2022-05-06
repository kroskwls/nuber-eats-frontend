import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { CATEGORY_QUERY } from '../../../graphql/queries';
import { render } from '../../../test-utils';
import { Category } from '../../client/category';

jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useParams: () => {
			return {
				slug: 'slug'
			}
		}
	};
});

describe('<Category />', () => {
	const mocks = [{
		request: {
			query: CATEGORY_QUERY,
			variables: {
				input: {
					page: 1,
					slug: 'slug'
				}
			}
		},
		result: {
			data: {
				categories: {
					ok: true,
					error: 'query-error',
					totalPages: 3,
					totalResults: 10,
					category: {
						__typename: "Category",
						id: 1,
						name: 'category-name',
						icon: 'icon-url',
						slug: 'category-slug',
						restaurantCount: 20
					},
					results: [{
						__typename: "Restaurant",
						id: 1,
						name: 'restaurant-name',
						coverImage: 'restaurant-cover-image-url',
						category: {
							id: 1,
							name: 'category-name',
							icon: 'icon-url',
							slug: 'category-slug',
							restaurantCount: 20
						},
						address: 'restaurant-address',
						isPromoted: false,
					}]
				}
			}
		}
	}];

	it('render OK', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Category />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
			expect(document.title).toBe('Category | Nuber Eats');
		});
	});

	it('render OK with restaurant data', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Category />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
			
			const categories = mocks[0].result.data.categories;
			const categoryName = categories.category.name;
			screen.getAllByText(categoryName);

			const restaurantName = categories.results[0].name;
			screen.getByText(restaurantName);

			const page = mocks[0].request.variables.input.page;
			const totalPages = categories.totalPages;
			screen.getByText(`Page ${page} of ${totalPages}`);
		});
	});
});