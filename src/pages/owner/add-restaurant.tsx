import { useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { CREATE_RESTAURANT_MUTATION } from '../../graphql/mutations';
import { MY_RESTAURANTS_QUERY } from '../../graphql/queries';
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from '../../__generated__/CreateRestaurantMutation';

interface IFormProps {
	name: string;
	address: string;
	categoryName: string;
	file: FileList;
}

export const AddRestaurant = () => {
	const [uploading, setUploading] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const client = useApolloClient();
	const history = useHistory();
	const [createRestaurantMutation, { data }] = useMutation<
		CreateRestaurantMutation,
		CreateRestaurantMutationVariables
	>(CREATE_RESTAURANT_MUTATION, {
		onCompleted: ({ createRestaurant: { ok, restaurantId } }) => {
			if (ok) {
				setUploading(false);
				const { name, categoryName, address } = getValues();
				const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
				const slug = categoryName.trim().toLowerCase().replace(/ /g, '-');
				client.writeQuery({
					query: MY_RESTAURANTS_QUERY,
					data: {
						myRestaurants: {
							...queryResult.myRestaurants,
							restaurants: [
								...queryResult.myRestaurants.restaurants,
								{
									__typename: "Restaurant",
									id: restaurantId,
									name,
									address,
									coverImage: imageUrl,
									isPromoted: false,
									category: {
										__typename: "Category",
										name: categoryName,
										slug
									},
								}
							],
						}
					}
				});
				history.push('/');
			}
		}
	});
	const { register, getValues, formState: { isValid }, handleSubmit } = useForm<IFormProps>({
		mode: 'onChange'
	});
	const onSubmit = async () => {
		try {
			setUploading(true);
			const { file, name, categoryName, address } = getValues();
			const data = new FormData();
			data.append('file', file[0]);
			const { url: coverImage } = await (
				await fetch('http://localhost:4000/uploads/', {
					method: 'post',
					body: data
				})
			).json();
			setImageUrl(coverImage);
			createRestaurantMutation({
				variables: {
					input: {
						name,
						categoryName,
						address,
						coverImage
					}
				}
			});
		} catch (error) { }
	};

	return (
		<div className='container-wrapper'>
			<Helmet>
				<title>Add Restaurant | Nuber Eats</title>
			</Helmet>
			<div className='container flex flex-col items-center mt-52'>
				<h1 className='font-semibold text-2xl mb-3'>Add Restaurant</h1>
				<form
					className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						className='input'
						placeholder='Name'
						{...register('name', {
							required: 'Name is required.'
						})}
					/>
					<input
						className='input'
						placeholder='Address'
						{...register('address', {
							required: 'Address is required.'
						})}
					/>
					<input
						className='input'
						placeholder='Category Name'
						{...register('categoryName', {
							required: 'Category Name is required.'
						})}
					/>
					<div>
						<input
							type='file'
							accept='image/*'
							{...register('file', {
								required: 'Cover image is required.'
							})}
						/>
					</div>
					<Button loading={uploading} canClick={isValid} actionText='Create Restaurant' />
					{data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
				</form>
			</div>
		</div>
	);
}