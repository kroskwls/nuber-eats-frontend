/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyRestaurantQuery
// ====================================================

export interface MyRestaurantQuery_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface MyRestaurantQuery_myRestaurant_restaurant_menu_options_choices {
  __typename: "OptionChoice";
  name: string;
  extra: number | null;
}

export interface MyRestaurantQuery_myRestaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: MyRestaurantQuery_myRestaurant_restaurant_menu_options_choices[] | null;
}

export interface MyRestaurantQuery_myRestaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: MyRestaurantQuery_myRestaurant_restaurant_menu_options[] | null;
}

export interface MyRestaurantQuery_myRestaurant_restaurant_orders {
  __typename: "Order";
  id: number;
  createdAt: any;
  total: number | null;
}

export interface MyRestaurantQuery_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: MyRestaurantQuery_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: MyRestaurantQuery_myRestaurant_restaurant_menu[] | null;
  orders: MyRestaurantQuery_myRestaurant_restaurant_orders[] | null;
}

export interface MyRestaurantQuery_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: MyRestaurantQuery_myRestaurant_restaurant | null;
}

export interface MyRestaurantQuery {
  myRestaurant: MyRestaurantQuery_myRestaurant;
}

export interface MyRestaurantQueryVariables {
  input: MyRestaurantInput;
}
