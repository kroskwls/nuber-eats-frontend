import React from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { LoginMutation, LoginMutationVariables } from '../__generated__/LoginMutation';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { Logo } from '../components/logo';

interface ILoginForm {
	email: string;
	password: string;
}

export const Login = () => {
	const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm<ILoginForm>({
		mode: 'onChange'
	});
	const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
		LoginMutation, LoginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted: ({ login: { ok, error, token } }: LoginMutation) => {
			if (ok && token) {
				localStorage.setItem(LOCALSTORAGE_TOKEN, token);
				authTokenVar(token);
				isLoggedInVar(true);
			}
		},
		onError: (error: ApolloError) => {

		}
	});

	const onSubmit = () => {
		const { email, password } = getValues();
		if (!loading && email && password) {
			loginMutation({
				variables: {
					input: { email, password }
				}
			});
		}
	};

	return (
		<div className='flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Login | Nuber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col items-center px-5'>
				<Logo className='mb-10 w-72' />
				<h4 className='w-full text-left text-3xl mb-5 font-semibold'>Welcome back</h4>
				<form className='grid gap-3 mt-7 mb-5 w-full' onSubmit={handleSubmit(onSubmit)}>
					<input
						className='input'
						placeholder='Email'
						{...register('email', {
							required: 'Email is required.',
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'Wrong email pattern'
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
					<Button canClick={isValid} loading={loading} actionText='Log In' />
					{loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
				</form>
				<div>
					New to Nuber? <Link className='link' to='/create-account'>Create an Account</Link>
				</div>
			</div>
		</div>
	);
}