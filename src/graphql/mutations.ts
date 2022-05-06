import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
	mutation LoginMutation ($input: LoginInput!) {
		login (input: $input) {
			ok
			error
			token
		}
	}
`;

export const CREATE_ACCOUNT_MUTATION = gql`
	mutation CreateAccountMutation ($input: CreateAccountInput!) {
		createAccount (input: $input) {
			ok
			error
		}
	}
`;

export const VERIFY_EMAIL_MUTATION = gql`
	mutation VerifyEmail ($input: VerifyEmailInput!) {
		verifyEmail (input: $input) {
			ok
			error
		}
	}
`;

export const EDIT_PROFILE_MUTATION = gql`
	mutation EditProfileMutation ($input: EditProfileInput!) {
		editProfile (input: $input) {
			ok
			error
		}
	}
`;

export const CREATE_RESTAURANT_MUTATION = gql`
	mutation CreateRestaurantMutation ($input: CreateRestaurantInput!) {
		createRestaurant (input: $input) {
			ok
			error
			restaurantId
		}
	}
`;

export const CREATE_DISH_MUTATION = gql`
	mutation CreateDishMutation ($input: CreateDishInput!) {
		createDish (input: $input) {
			ok
			error
		}
	}
`;

export const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrderMutation ($input: CreateOrderInput!) {
		createOrder (input: $input) {
			ok
			error
			orderId
		}
	}
`;

export const EDIT_ORDER_MUTATION = gql`
	mutation EditOrderMutation ($input: EditOrderInput!) {
		editOrder (input: $input) {
			ok
			error
		}
	}
`;

export const TAKE_ORDER_MUTATION = gql`
	mutation TakeOrderMutation ($input: TakeOrderInput!) {
		takeOrder (input: $input) {
			ok
			error
		}
	}
`;