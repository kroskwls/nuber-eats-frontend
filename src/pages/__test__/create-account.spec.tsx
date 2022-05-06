import { ApolloProvider } from '@apollo/client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { CREATE_ACCOUNT_MUTATION } from '../../graphql/mutations';
import { render } from '../../test-utils';
import { UserRole } from '../../__generated__/globalTypes';
import { CreateAccount } from '../create-account';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useHistory: () => {
			return {
				push: mockPush
			};
		}
	};
});

describe('<CreateAccount />', () => {
	let mockedClient: MockApolloClient;

	beforeEach(async () => {
		await waitFor(async () => {
			mockedClient = createMockClient();
			await render(
				<ApolloProvider client={mockedClient}>
					<CreateAccount />
				</ApolloProvider>
			);
		});
	});

	it('render OK', async () => {
		await waitFor(() => {
			expect(document.title).toBe('Create Account | Nuber Eats');
		});
	});

	it('render validation errors', async () => {
		const email = screen.getByPlaceholderText(/email/i);
		const button = screen.getByRole('button');

		await waitFor(async () => {
			await userEvent.type(email, 'wrong@test');
		});
		let error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Wrong email pattern.');

		await waitFor(async () => {
			await userEvent.clear(email);
		});
		error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Email is required.');

		await waitFor(async () => {
			await userEvent.type(email, 'right@test.com');
		});
		expect(screen.queryByRole('alert')).toBe(null);

		await waitFor(async () => {
			await userEvent.click(button);
		});
		error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Password is required.');
	});

	it('submit mutation with form values', async () => {
		const email = screen.getByPlaceholderText(/email/i);
		const password = screen.getByPlaceholderText(/password/i);
		const button = screen.getByRole('button');
		const formData = {
			email: 'right@test.com',
			password: '12345',
			role: UserRole.Client
		};

		const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
			data: {
				createAccount: {
					ok: true,
					error: 'mutation-error'
				}
			}
		});
		mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse);
		jest.spyOn(window, 'alert').mockImplementation(() => null);
		await waitFor(async () => {
			await userEvent.type(email, formData.email);
			await userEvent.type(password, formData.password);
			await userEvent.click(button);
		});
		expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedLoginMutationResponse).toHaveBeenCalledWith({ input: formData });
		expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');
		expect(mockPush).toHaveBeenCalledWith('/');
		const mutationError = screen.getByRole('alert');
		expect(mutationError).toHaveTextContent('mutation-error');
	});

	afterAll(() => {
		jest.clearAllMocks();
	});
});
