/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: OneRestaurantQuery
// ====================================================

export interface OneRestaurantQuery_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface OneRestaurantQuery_restaurant_restaurant_menu_options_choices {
  __typename: "OptionChoice";
  name: string;
  extra: number | null;
}

export interface OneRestaurantQuery_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: OneRestaurantQuery_restaurant_restaurant_menu_options_choices[] | null;
}

export interface OneRestaurantQuery_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: OneRestaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export interface OneRestaurantQuery_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: OneRestaurantQuery_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: OneRestaurantQuery_restaurant_restaurant_menu[] | null;
}

export interface OneRestaurantQuery_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: OneRestaurantQuery_restaurant_restaurant | null;
}

export interface OneRestaurantQuery {
  restaurant: OneRestaurantQuery_restaurant;
}

export interface OneRestaurantQueryVariables {
  input: RestaurantInput;
}
