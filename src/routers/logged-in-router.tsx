import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { Header } from '../components/header';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { RestaurantDetail } from '../pages/client/restaurant';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { Dashboard } from '../pages/driver/dashboard';
import { Order } from '../pages/order';
import { AddDish } from '../pages/owner/add-dish';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { UserRole } from '../__generated__/globalTypes';

const commonRoutes = [
	{
		path: '/confirm',
		component: <ConfirmEmail />
	}, {
		path: '/edit-profile',
		component: <EditProfile />
	}, {
		path: '/orders/:id',
		component: <Order />
	}
];
const clientRoutes = [
	{
		path: '/',
		component: <Restaurants />
	}, {
		path: '/search',
		component: <Search />
	}, {
		path: '/category/:slug',
		component: <Category />
	}, {
		path: '/restaurant/:id',
		component: <RestaurantDetail />
	}
];
const ownerRoutes = [
	{
		path: '/',
		component: <MyRestaurants />
	}, {
		path: '/add-restaurant',
		component: <AddRestaurant />
	}, {
		path: '/restaurant/:id',
		component: <MyRestaurant />
	}, {
		path: '/restaurant/:id/add-dish',
		component: <AddDish />
	},
];
const driverRoutes = [
	{
		path: '/',
		component: <Dashboard />
	}
];

export const LoggedInRouter = () => {
	const { data, loading, error } = useMe();
	if (loading) {
		return (
			<div className='h-screen flex justify-center items-center text-2xl font-bold tracking-wide'>
				<span>Loading...</span>
			</div>
		);
	} else if (error?.message === 'Forbidden resource') {
		localStorage.setItem(LOCALSTORAGE_TOKEN, '');
		authTokenVar(null);
		isLoggedInVar(false);
	}

	return (
		<BrowserRouter>
			<div className='flex flex-col h-screen'>
				<Header />
				<Switch>
					{commonRoutes.map(({ path, component }) => (
						<Route exact key={path} path={path}>{component}</Route>
					))}
					{data?.me.role === UserRole.Client && clientRoutes.map(({ path, component }) => (
						<Route exact key={path} path={path}>{component}</Route>
					))}
					{data?.me.role === UserRole.Owner && ownerRoutes.map(({ path, component }) => (
						<Route exact key={path} path={path}>{component}</Route>
					))}
					{data?.me.role === UserRole.Delivery && driverRoutes.map(({ path, component }) => (
						<Route exact key={path} path={path}>{component}</Route>
					))}
					{/* <Redirect to='/' /> */}
					<Route>
						<NotFound />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
}


// <div>
// <button onClick={() => {
// 	localStorage.setItem(LOCALSTORAGE_TOKEN, "");
// 	authTokenVar(null);
// 	isLoggedInVar(false);
// }}>Log out</button>
// </div>