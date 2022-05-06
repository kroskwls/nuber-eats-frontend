import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFound = () => (
	<div className='flex flex-col flex-grow items-center justify-center'>
		<Helmet>
			<title>Not Found | Nuber Eats</title>
		</Helmet>
		<h2 className='text-2xl font-bold mb-3'>Page Not Found.</h2>
		<h4 className='text-base font-semibold mb-5'>The page you're looking for does not exist or has moved.</h4>
		<Link className='link' to='/'>Go back home &rarr;</Link>
	</div>
)