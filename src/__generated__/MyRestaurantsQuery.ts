/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyRestaurantsQuery
// ====================================================

export interface MyRestaurantsQuery_myRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface MyRestaurantsQuery_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: MyRestaurantsQuery_myRestaurants_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface MyRestaurantsQuery_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  restaurants: MyRestaurantsQuery_myRestaurants_restaurants[] | null;
}

export interface MyRestaurantsQuery {
  myRestaurants: MyRestaurantsQuery_myRestaurants;
}
