import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
	fragment RestaurantParts on Restaurant {
		id
		name
		coverImage
		category {
			name
			slug
		}
		address
		isPromoted
	}
`;

export const CATEGORY_FRAGMENT = gql`
	fragment CategoryParts on Category {
		id
		name
		icon
		slug
		restaurantCount
	}
`;

export const DISH_FRAGMENT = gql`
	fragment DishParts on Dish {
		id
		name
		price
		photo
		description
		options {
			name
			extra 
			choices {
				name
				extra
			}
		}
	}
`;

export const ORDERS_FRAGMENT = gql`
	fragment OrderParts on Order {
		id
		createdAt
		total
	}
`;

export const FULL_ORDER_FRAGMENT = gql`
	fragment FullOrderParts on Order {
		id
		status
		total
		driver {
			email
		}
		customer {
			email
		}
		restaurant {
			name
		}
	}	
`;