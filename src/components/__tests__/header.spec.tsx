import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Header } from '../header';
import { MockedProvider } from '@apollo/client/testing';
import { ME_QUERY } from '../../graphql/queries';
import userEvent from '@testing-library/user-event';
import { render } from '../../test-utils';
import { LOCALSTORAGE_TOKEN } from '../../constants';
import { authTokenVar, isLoggedInVar } from '../../apollo';

jest.mock('../../routers/logged-out-router', () => {
	return {
		LoggedOutRouter: () => <span>logged-out</span>
	};
});
jest.mock('../../apollo', () => {
	return {
		authTokenVar: jest.fn(),
		isLoggedInVar: jest.fn(),
	};
});

describe('<Header />', () => {
	const mocks = [
		{
			request: {
				query: ME_QUERY
			},
			result: {
				data: {
					me: {
						id: 1,
						email: 'test@email.com',
						role: 'Client',
						verified: false,
					}
				}
			}
		}
	];

	it('render verify banner', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Header />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
			screen.getByText('Please verify your email.');
		});
	});

	it('render without verify banner', async () => {
		mocks[0].result.data.me.verified = true;
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Header />
				</MockedProvider>
			);
			await new Promise(resolve => setTimeout(resolve, 5));
			const banner = screen.queryByText('Please verify your email.');
			expect(banner).toBeNull();
		});
	});

	it('should be logged out', async () => {
		await waitFor(async () => {
			await render(
				<MockedProvider mocks={mocks}>
					<Header />
				</MockedProvider>
			);
		});

		jest.spyOn(Storage.prototype, 'setItem');
		const button = screen.getByRole('button');
		await waitFor(async () => {
			await userEvent.click(button);
		});
		expect(localStorage.setItem).toHaveBeenCalledWith(LOCALSTORAGE_TOKEN, '');
		expect(authTokenVar).toHaveBeenCalledWith(null);
		expect(isLoggedInVar).toHaveBeenCalledWith(false);
	});
});