import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { useMutation, useSubscription } from '@apollo/client';
import { CookedOrderSubscription } from '../../__generated__/CookedOrderSubscription';
import { COOKED_ORDER_SUBSCRIPTION } from '../../graphql/subscriptions';
import { useHistory } from 'react-router-dom';
import { TAKE_ORDER_MUTATION } from '../../graphql/mutations';
import { TakeOrderMutation, TakeOrderMutationVariables } from '../../__generated__/TakeOrderMutation';

interface ICoords {
	lat: number;
	lng: number;
}

// interface IDriverProps {
// 	lat: number;
// 	lng: number;
// 	$hover?: any;
// }

// const Driver: React.FC<IDriverProps> = () => <div className='text-lg'>🛵</div>;

export const Dashboard = () => {
	const [map, setMap] = useState<google.maps.Map>();
	const defaultCoords = { lat: 0, lng: 0 };
	const [driverCoords, setDriverCoords] = useState<ICoords>(defaultCoords);
	const onSuccess = ({ coords: { latitude: lat, longitude: lng } }: GeolocationPosition) => {
		setDriverCoords({ lat, lng });
	};
	const onError = (error: GeolocationPositionError) => {
		console.log(error);
	};
	useEffect(() => {
		navigator.geolocation.watchPosition(onSuccess, onError, {
			enableHighAccuracy: true
		});
	});
	useEffect(() => {
		if (map) {
			map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
			// const geocoder = new google.maps.Geocoder();
			// geocoder.geocode({
			// 	location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng)
			// }, (results, status) => {
			// 	console.log(status, results)
			// 	if (status === google.maps.GeocoderStatus.OK) {

			// 	}
			// });
		}
	}, [driverCoords, map])
	const onApiLoaded = ({ map, maps }: any) => {
		setMap(map);
		map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
	};
	const { data: cookedOrderData } = useSubscription<CookedOrderSubscription>(COOKED_ORDER_SUBSCRIPTION);
	const makeRoute = () => {
		if (map) {
			const directionsService = new google.maps.DirectionsService();
			const directionsRenderer = new google.maps.DirectionsRenderer();
			console.log(driverCoords);

			directionsRenderer.setMap(map);
			directionsService.route({
				origin: {
					location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng)
				},
				destination: {
					location: new google.maps.LatLng(driverCoords.lat - 0.001, driverCoords.lng + 0.0025)
				},
				travelMode: google.maps.TravelMode.DRIVING
			}, (results, status) => {
				directionsRenderer.setDirections(results);
			});
		}
	};
	useEffect(() => {
		if (cookedOrderData?.cookedOrders.id) {
			makeRoute();
		}
	}, [cookedOrderData]);
	const history = useHistory();
	const [takeOrderMutation, { loading }] = useMutation<
		TakeOrderMutation, TakeOrderMutationVariables
	>(TAKE_ORDER_MUTATION, {
		onCompleted: ({ takeOrder: { ok } }) => {
			if (ok) {
				history.push(`/orders/${cookedOrderData?.cookedOrders.id}`)
			}
		}
	});
	const triggerMutation = (orderId: number) => {
		if (loading) {
			return;
		}

		takeOrderMutation({
			variables: {
				input: { id: orderId }
			}
		});
	};

	return (
		<div className='overflow-hidden flex-grow'>
			<div className='w-screen h-1/2'>
				<GoogleMapReact
					bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY as string }}
					defaultCenter={defaultCoords}
					defaultZoom={18}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={onApiLoaded}
				>
					{/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} /> */}
				</GoogleMapReact>
			</div>
			<div className='max-w-screen-sm mx-auto bg-gray-800 text-white relative -top-10 shadow-2xl py-8 px-5'>
				{cookedOrderData?.cookedOrders.restaurant ? (
					<div>
						<h1 className='text-center text-3xl font-semibold'>
							New Cooked Order
						</h1>
						<h4 className='text-center text-3xl font-semibold mt-3'>
							Pick it up soon! @ {cookedOrderData?.cookedOrders.restaurant?.name}
						</h4>
						<button className='btn w-full mt-10 block text-center' onClick={() => triggerMutation(cookedOrderData?.cookedOrders.id)}>
							Accept Challenge &rarr;
						</button>
						{/* <Link className='btn w-full mt-10 block text-center' to={`/orders/${cookedOrderData?.cookedOrders.id}`}>
							Accept Challenge &rarr;
						</Link> */}
					</div>
				) : (
					<h1 className='text-center text-3xl font-semibold'>No orders yet...</h1>
				)}
			</div>
		</div>
	);
}