import React from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { CREATE_ACCOUNT_MUTATION } from '../graphql/mutations';
import { Button } from '../components/button';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreateAccountMutation, CreateAccountMutationVariables } from '../__generated__/CreateAccountMutation';
import { UserRole } from '../__generated__/globalTypes';
import { Logo } from '../components/logo';

interface ICreateAccountForm {
	email: string;
	password: string;
	role: UserRole;
}

export const CreateAccount = () => {
	const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm<ICreateAccountForm>({
		mode: 'onChange',
		defaultValues: {
			role: UserRole.Client
		}
	});
	const history = useHistory();
	const [createAccountMutation, { data: createAccountResult, loading }] = useMutation<
		CreateAccountMutation, CreateAccountMutationVariables
	>(CREATE_ACCOUNT_MUTATION, {
		onCompleted: ({ createAccount: { ok, error } }: CreateAccountMutation) => {
			if (ok) {
				alert('Account Created! Log in now!');
				history.push('/');
			}
		},
		onError: (error: ApolloError) => {

		}
	});

	const onSubmit = () => {
		if (!loading) {
			const { email, password, role } = getValues();
			createAccountMutation({
				variables: {
					input: { email, password, role }
				}
			});
		}
	};

	return (
		<div className='flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Create Account | Nuber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col items-center px-5'>
				<Logo className='mb-10 w-72' />
				<h4 className='w-full text-left text-3xl mb-5 font-semibold'>Let's get started</h4>
				<form className='grid gap-3 mt-7 mb-5 w-full' onSubmit={handleSubmit(onSubmit)}>
					<input
						className='input'
						placeholder='Email'
						{...register('email', {
							required: 'Email is required.',
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'Wrong email pattern.'
							}
						})}
					/>
					{errors.email?.message && <FormError errorMessage={errors.email.message} />}
					<input
						type='password'
						className='input'
						placeholder='Password'
						{...register('password', {
							required: 'Password is required.'
						})}
					/>
					{errors.password?.message && <FormError errorMessage={errors.password.message} />}
					<select
						className='input'
						{...register('role', {
							required: 'Role is required.'
						})}
					>
						{Object.keys(UserRole).map(role => <option key={role}>{role}</option>)}
					</select>
					<Button canClick={isValid} loading={loading} actionText='Create Account' />
					{createAccountResult?.createAccount.error && <FormError errorMessage={createAccountResult.createAccount.error} />}
				</form>
				<div>
					Already have an account? <Link className='link' to='/'>Log in now</Link>
				</div>
			</div>
		</div>
	);
}