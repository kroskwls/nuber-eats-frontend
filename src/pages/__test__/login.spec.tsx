import { ApolloProvider } from '@apollo/client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { LOGIN_MUTATION } from '../../graphql/mutations';
import { render } from '../../test-utils';
import { Login } from '../login';

describe('<Login />', () => {
	let mockedClient: MockApolloClient;

	beforeEach(async () => {
		await waitFor(async () => {
			mockedClient = createMockClient();
			await render(
				<ApolloProvider client={mockedClient}>
					<Login />
				</ApolloProvider>
			);
		});
	});

	it('render OK', async () => {
		await waitFor(() => {
			expect(document.title).toBe('Login | Nuber Eats');
		});
	});

	it('display email validation errors', async () => {
		const inputEmail = screen.getByPlaceholderText(/email/i);
		await waitFor(async () => {
			await userEvent.type(inputEmail, 'test@wrong');
		});
		const error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Wrong email pattern');

		await waitFor(async () => {
			await userEvent.clear(inputEmail);
		});
		expect(error).toHaveTextContent('Email is required.');
	});

	it('display password required errors', async () => {
		const inputEmail = screen.getByPlaceholderText(/email/i);
		const submitBtn = screen.getByRole('button');
		await waitFor(async () => {
			await userEvent.type(inputEmail, 'right@test.com');
			await userEvent.click(submitBtn);
		});
		const error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Password is required.');
	});

	it('submit form and calls mutation', async () => {
		const formData = {
			email: 'right@test.com',
			password: '12345'
		};
		const inputEmail = screen.getByPlaceholderText(/email/i);
		const inputPassword = screen.getByPlaceholderText(/password/i);
		const submitBtn = screen.getByRole('button');
		const mockedMutationResponse = jest.fn().mockResolvedValue({
			data: {
				login: {
					ok: true,
					token: 'token',
					error: 'mutation-error',
				},
			},
		});
		mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
		jest.spyOn(Storage.prototype, 'setItem');

		await waitFor(async () => {
			await userEvent.type(inputEmail, formData.email);
			await userEvent.type(inputPassword, formData.password);
			await userEvent.click(submitBtn);
		});
		expect(inputEmail).toHaveValue(formData.email);
		expect(inputPassword).toHaveValue(formData.password);

		expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedMutationResponse).toHaveBeenCalledWith({ input: { ...formData } });

		const error = screen.getByRole('alert');
		expect(error).toHaveTextContent('mutation-error');
		expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'token');
	});
});