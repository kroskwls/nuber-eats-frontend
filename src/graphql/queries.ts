import { gql } from "@apollo/client";
import { CATEGORY_FRAGMENT, DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "./fragments";

export const ME_QUERY = gql`
	query MeQuery {
		me {
			id
			email
			role
			verified
		}
	}
`;

export const ALL_RESTAURANT_QUERY = gql`
	query RestaurantsPageQuery ($input: AllRestaurantInput!) {
		allCategories{
			ok
			error
			categories {
				...CategoryParts
			}
		}
		restaurants (input: $input) {
			ok
			error
			totalPages
			totalResults
			results {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

export const SEARCH_RESTAURANTS_QUERY = gql`
	query SearchRestaurants ($input: SearchRestaurantsInput!) {
		searchRestaurants (input: $input) {
			ok
			error
			totalPages
			totalResults
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

export const CATEGORY_QUERY = gql`
	query CategoryQuery ($input: CategoryInput!) {
		categories (input: $input) {
			ok
			error
			totalPages
			totalResults
			category {
				...CategoryParts
			}
			results {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

export const ONE_RESTAURANT_QUERY = gql`
	query OneRestaurantQuery ($input: RestaurantInput!) {
		restaurant (input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
`;

export const MY_RESTAURANTS_QUERY = gql`
	query MyRestaurantsQuery {
		myRestaurants {
			ok
			error
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

export const MY_RESTAURANT_QUERY = gql`
	query MyRestaurantQuery ($input: MyRestaurantInput!) {
		myRestaurant (input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
				orders {
					...OrderParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
	${ORDERS_FRAGMENT}
`;

export const GET_ONE_ORDER_QUERY = gql`
	query GetOneOrderQuery ($input: GetOneOrderInput!) {
		getOneOrder (input: $input) {
			ok
			error
			order {
				...FullOrderParts
			}
		}
	}
	${FULL_ORDER_FRAGMENT}
`;