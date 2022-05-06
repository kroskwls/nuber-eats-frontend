import React, { useEffect } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { VERIFY_EMAIL_MUTATION } from '../../graphql/mutations';
import { VerifyEmail, VerifyEmailVariables } from '../../__generated__/VerifyEmail';
import { useHistory, useLocation } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import { Helmet } from 'react-helmet-async';

export const ConfirmEmail = () => {
	const location = useLocation();
	const history = useHistory();
	const client = useApolloClient();
	const { data: userData } = useMe();
	const [verifyEmail] = useMutation<
		VerifyEmail, VerifyEmailVariables
	>(VERIFY_EMAIL_MUTATION, {
		onCompleted: ({ verifyEmail: { ok, error } }: VerifyEmail) => {
			if (ok && userData?.me.id) {
				client.writeFragment({
					id: `User:${userData?.me.id}`,
					fragment: gql`
						fragment VerifiedUser on User {
							verified
						}
					`,
					data: {
						verified: true
					}
				});
				history.push('/');
			}
		}
	});

	useEffect(() => {
		const code = location.search.split('code=')[1];
		verifyEmail({
			variables: {
				input: {
					code
				}
			}
		});
	}, []);

	return (
		<div className='mt-52 flex flex-col justify-center items-center'>
			<Helmet>
				<title>Verify Email | Nuber Eats</title>
			</Helmet>
			<h2 className='text-lg font-semibold'>Confirming email...</h2>
			<h4 className='text-gray-700 text-sm'>Please wait, dont't close this page.</h4>
		</div>
	);
}