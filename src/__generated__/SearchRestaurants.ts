/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchRestaurants
// ====================================================

export interface SearchRestaurants_searchRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface SearchRestaurants_searchRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: SearchRestaurants_searchRestaurants_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface SearchRestaurants_searchRestaurants {
  __typename: "SearchRestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: SearchRestaurants_searchRestaurants_restaurants[] | null;
}

export interface SearchRestaurants {
  searchRestaurants: SearchRestaurants_searchRestaurants;
}

export interface SearchRestaurantsVariables {
  input: SearchRestaurantsInput;
}
