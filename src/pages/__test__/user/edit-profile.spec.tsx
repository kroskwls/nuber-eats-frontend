import { ApolloProvider } from '@apollo/client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient } from 'mock-apollo-client';
import React from 'react';
import { EDIT_PROFILE_MUTATION } from '../../../graphql/mutations';
import { render } from '../../../test-utils';
import { EditProfile } from '../../user/edit-profile';

jest.mock('../../../hooks/useMe', () => {
	return {
		useMe: () => {
			return {
				data: {
					me: {
						id: 1,
						email: 'test@email.com',
						role: 'Client',
						verified: false,
					}
				}
			};
		}
	};
});
const mockWriteFragment = jest.fn();
jest.mock('@apollo/client', () => {
	const realModule = jest.requireActual('@apollo/client');
	return {
		...realModule,
		useApolloClient: () => {
			return {
				writeFragment: mockWriteFragment
			};
		}
	};
});

describe('<EditProfile />', () => {
	let mockedClient = createMockClient();
	const setup = () => {
		render(
			<ApolloProvider client={mockedClient}>
				<EditProfile />
			</ApolloProvider>
		);
	};

	it('render OK', async () => {
		setup();

		await waitFor(() => {
			expect(document.title).toBe('Edit Profile | Nuber Eats');
		});
	});

	it('should display email validation error', async () => {
		setup();

		await waitFor(async () => {
			const inputEmail = screen.getByPlaceholderText('Email');
			const submitBtn = screen.getByRole('button');

			await userEvent.type(inputEmail, 'wrong@test');
			await userEvent.click(submitBtn);
		});

		const error = screen.getByRole('alert');
		expect(error).toHaveTextContent('Wrong email pattern');
	});

	it('submit form and calls mutation', async () => {
		const mockedMutationResponse = jest.fn().mockResolvedValue({
			data: {
				editProfile: {
					ok: true,
					error: 'mutation-error',
				},
			},
		});
		mockedClient.setRequestHandler(EDIT_PROFILE_MUTATION, mockedMutationResponse);

		setup();

		const input = {
			email: 'right@test.com',
			password: '12345'
		};

		const inputEmail = screen.getByPlaceholderText('Email');
		const inputPassword = screen.getByPlaceholderText('Password');
		const submitBtn = screen.getByRole('button');

		await waitFor(async () => {
			await userEvent.clear(inputEmail);
			await userEvent.type(inputEmail, input.email);
			await userEvent.type(inputPassword, input.password);
			await userEvent.click(submitBtn);
		});
		expect(inputEmail).toHaveValue(input.email);
		expect(inputPassword).toHaveValue(input.password);

		expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedMutationResponse).toHaveBeenCalledWith({ input });

		expect(mockWriteFragment).toHaveBeenCalledTimes(1);
	});
});