import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { CREATE_DISH_MUTATION } from '../../graphql/mutations';
import { MY_RESTAURANT_QUERY } from '../../graphql/queries';
import { CreateDishMutation, CreateDishMutationVariables } from '../../__generated__/CreateDishMutation';

interface IParams {
	id: string;
}

interface IFormProps {
	name: string;
	price: string;
	description: string;
	file: FileList;
	[key: string]: any;
}

export const AddDish = () => {
	const { id } = useParams<IParams>();
	const history = useHistory();
	const [createDishMutation, { loading }] = useMutation<
		CreateDishMutation, CreateDishMutationVariables
	>(CREATE_DISH_MUTATION, {
		refetchQueries: [{
			query: MY_RESTAURANT_QUERY,
			variables: {
				input: {
					id: +id
				}
			}
		}],
		onCompleted: ({ createDish: { ok } }) => {
			if (ok) {
				history.goBack();
			}
		}
	});
	const { register, handleSubmit, getValues, setValue, formState: { isValid, errors } } = useForm<IFormProps>({
		mode: 'onChange'
	});
	const [uploading, setUploading] = useState(false);
	const onSubmit = async () => {
		try {
			setUploading(true);
			const { file, name, price, description, ...rest } = getValues();
			const options = optionsNumber.map(theId => {
				const choices = choicesNumber
					.filter(choiceId => choiceId.includes(String(theId)))
					.map(choiceId => ({
						name: rest[`${choiceId}-choiceName`],
						extra: +rest[`${choiceId}-choiceExtra`],
					}));
				return {
					name: rest[`${theId}-optionName`],
					extra: +rest[`${theId}-optionExtra`],
					choices
				};
			});
			const data = new FormData();
			data.append('file', file[0]);
			const { url: photo } = await (
				await fetch('http://localhost:4000/uploads/', {
					method: 'post',
					body: data
				})
			).json();
			console.log(photo);

			createDishMutation({
				variables: {
					input: {
						restaurantId: +id,
						name,
						price: +price,
						description,
						options,
						photo
					}
				}
			});
		} catch (error) { }
	};
	const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
	const onAddOptionClick = () => {
		setOptionsNumber(current => [...current, Date.now()]);
	};
	const onDeleteOptionClick = (idToDelete: number) => {
		setOptionsNumber(current => current.filter(id => id !== idToDelete));
		setValue(`${idToDelete}-optionName`, '');
		setValue(`${idToDelete}-optionExtra`, '');
	};
	const [choicesNumber, setChoicesNumber] = useState<string[]>([]);
	const onAddChoiceClick = (parentId: number) => {
		setChoicesNumber(current => [...current, `${parentId}-${Date.now()}`]);
	};
	const onDeleteChoiceClick = (idToDelete: string) => {
		setChoicesNumber(current => current.filter(id => id !== idToDelete));
		setValue(`${idToDelete}-choiceName`, '');
		setValue(`${idToDelete}-choiceExtra`, '');
	};

	return (
		<div className='container-wrapper'>
			<Helmet>
				<title>Add Dish | Nuber Eats</title>
			</Helmet>
			<div className='container flex flex-col items-center mt-52'>
				<h1 className='font-semibold text-2xl mb-3'>Add Dish</h1>
				<form
					className='grid gap-3 w-full max-w-screen-sm my-5 mx-auto'
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						className='input'
						type='text'
						placeholder='Name'
						{...register('name', {
							required: 'Name is required.'
						})}
					/>
					{errors.name?.message && <FormError errorMessage={errors.name.message} />}
					<input
						className='input'
						type='number'
						step={0.01}
						min={0}
						placeholder='Price'
						{...register('price', {
							required: 'Price is required.'
						})}
					/>
					{errors.price?.message && <FormError errorMessage={errors.price.message} />}
					<input
						className='input'
						type='text'
						placeholder='Description'
						{...register('description', {
							required: 'Description is required.'
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
					<div className='my-10'>
						<h4 className='font-medium mb-3 text-lg'>Dish Option</h4>
						<span
							className='cursor-pointer text-white bg-gray-900 py-2 px-3 mt-5'
							onClick={onAddOptionClick}
						>Add Dish Option</span>
						{optionsNumber.length !== 0 && optionsNumber.map(id => (
							<div key={id} className='mt-5'>
								<div>
									<input
										{...register(`${id}-optionName`)}
										className='py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3'
										type='text'
										placeholder='Option Name' />
									<input
										{...register(`${id}-optionExtra`)}
										className='py-2 px-4 w-32 focus:outline-none focus:border-gray-600 border-2'
										type='number'
										step={0.01}
										placeholder='Extra Price'
										min={0}
									/>
									<span
										className="cursor-pointer text-white bg-gray-900 ml-3 py-3 px-4 mt-5"
										onClick={() => onAddChoiceClick(id)}
									>Add Choice</span>
									<span
										className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
										onClick={() => onDeleteOptionClick(id)}
									>Delete Option</span>
								</div>
								<div className='pl-10'>
									{choicesNumber.filter(choiceId => choiceId.includes(String(id))).map(choiceId =>
										<div key={choiceId} className='pt-2'>
											<input
												{...register(`${choiceId}-choiceName`)}
												className='py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3'
												type='text'
												placeholder='Choice Name' />
											<input
												{...register(`${choiceId}-choiceExtra`)}
												className='py-2 px-4 w-32 focus:outline-none focus:border-gray-600 border-2'
												type='number'
												step={0.01}
												placeholder='Extra Price'
												min={0}
											/>
											<span
												className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
												onClick={() => onDeleteChoiceClick(choiceId)}
											>Delete Choice</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
					{errors.description?.message && <FormError errorMessage={errors.description.message} />}
					<Button actionText='Create Dish' canClick={isValid && !(uploading || loading)} loading={uploading || loading} />
				</form>
			</div>
		</div>
	);
}