import React from 'react';
import { useMe } from '../hooks/useMe';
import { Logo } from './logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

export const Header = () => {
	const { data: userData } = useMe();
	const history = useHistory();
	return (
		<>
			{!userData?.me.verified && (
				<div className='bg-red-500 p-3 text-center text-base text-white'>
					<span>Please verify your email.</span>
				</div>
			)}
			<header className='py-6 container-wrapper border-b'>
				<div className='w-full container flex justify-between items-center'>
					<Link to='/'>
						<Logo className='w-36' />
					</Link>
					<span className='text-xs'>
						<Link to='/edit-profile'>
							<FontAwesomeIcon icon={faUser} className='text-xl' />
							{userData?.me.email}
						</Link>
						<span
							role='button'
							onClick={() => {
								localStorage.setItem(LOCALSTORAGE_TOKEN, '');
								authTokenVar(null);
								isLoggedInVar(false);
								history.push('/');
							}}
						>
							<FontAwesomeIcon icon={faSignOut} className='text-xl ml-5 cursor-pointer' />
						</span>
					</span>
				</div>
			</header>
		</>
	);
};