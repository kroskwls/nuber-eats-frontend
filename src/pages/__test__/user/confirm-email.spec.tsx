import { ApolloProvider } from '@apollo/client';
import { waitFor } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';
import React from 'react';
import { VERIFY_EMAIL_MUTATION } from '../../../graphql/mutations';
import { render } from '../../../test-utils';
import { ConfirmEmail } from '../../user/confirm-email';

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
const code = 'param-code';
const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useLocation: () => {
			return {
				search: `code=${code}`
			};
		},
		useHistory: () => {
			return {
				push: mockPush
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

describe('<ConfirmEmail />', () => {
	let mockedClient = createMockClient()
	const setup = () => {
		render(
			<ApolloProvider client={mockedClient}>
				<ConfirmEmail />
			</ApolloProvider>
		);
	};

	it('render OK with verifyEmail mutation with code in params', async () => {
		const mockedMutationResponse = jest.fn().mockResolvedValue({
			data: {
				verifyEmail: {
					ok: true,
					error: 'mutation-error',
				},
			},
		});
		mockedClient.setRequestHandler(VERIFY_EMAIL_MUTATION, mockedMutationResponse);

		setup();

		await waitFor(() => {
			expect(document.title).toBe('Verify Email | Nuber Eats');
		});
		expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedMutationResponse).toHaveBeenCalledWith({ input: { code } });

		expect(mockWriteFragment).toHaveBeenCalledTimes(1);

		expect(mockPush).toHaveBeenCalledTimes(1);
		expect(mockPush).toHaveBeenCalledWith('/');
	});
});