import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { EDIT_PROFILE_MUTATION } from '../../graphql/mutations';
import { useMe } from '../../hooks/useMe';
import { EditProfileMutation, EditProfileMutationVariables } from '../../__generated__/EditProfileMutation';

interface IEditForm {
	email?: string;
	password?: string;
}

export const EditProfile = () => {
	const client = useApolloClient();
	const { data: userData, refetch } = useMe();
	const { register, handleSubmit, getValues, formState: { isValid, errors } } = useForm<IEditForm>({
		mode: 'onChange',
		defaultValues: {
			email: userData?.me.email
		}
	});
	const [editProfileMutation, { loading }] = useMutation<
		EditProfileMutation, EditProfileMutationVariables
	>(EDIT_PROFILE_MUTATION, {
		onCompleted: async ({ editProfile: { ok, error } }: EditProfileMutation) => {
			if (ok && userData) {
				// refetch : 백엔드에서 가장 최신 데이터를 가져와서 cache 함
				// 		대신 api를 호출하는 것이기 때문에 응답시간이 발생함
				// 		cache를 직접 수정하는 것보다 속도가 느림(당연함)
				// 		하지만 코드짜기 쉬움..ㅎ
				// await refetch(); 
				const { me: { id, email: prevEmail } } = userData;
				const { email: newEmail } = getValues();
				if (prevEmail !== newEmail) {
					// update cache
					client.writeFragment({
						id: `User:${id}`,
						fragment: gql`
							fragment UpdateProfile on User {
								email
								verified
							}
						`,
						data: {
							email: newEmail,
							verified: false
						}
					});
				}
			}
		}
	});
	const onSubmit = () => {
		const { email, password } = getValues();
		editProfileMutation({
			variables: {
				input: {
					email,
					...(password !== '' && { password })
				}
			}
		});
	};

	return (
		<div className='mt-52 flex flex-col justify-center items-center'>
			<Helmet>
				<title>Edit Profile | Nuber Eats</title>
			</Helmet>
			<h2 className='text-2xl font-bold mb-3'>Edit Profile</h2>
			<form className='grid gap-3 w-full max-w-screen-sm my-5' onSubmit={handleSubmit(onSubmit)}>
				<input
					className='input'
					type='email'
					placeholder='Email'
					{...register('email', {
						pattern: {
							value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							message: 'Wrong email pattern'
						}
					})}
				/>
				{errors.email?.message && <FormError errorMessage={errors.email.message} />}
				<input
					className='input'
					type='password'
					placeholder='Password'
					{...register('password')}
				/>
				<Button canClick={isValid} loading={loading} actionText='Save Profile' />
			</form>
		</div>
	);
}