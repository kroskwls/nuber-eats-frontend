/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: CategoryQuery
// ====================================================

export interface CategoryQuery_categories_category {
  __typename: "Category";
  id: number;
  name: string;
  icon: string | null;
  slug: string;
  restaurantCount: number;
}

export interface CategoryQuery_categories_results_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface CategoryQuery_categories_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: CategoryQuery_categories_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface CategoryQuery_categories {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  category: CategoryQuery_categories_category | null;
  results: CategoryQuery_categories_results[] | null;
}

export interface CategoryQuery {
  categories: CategoryQuery_categories;
}

export interface CategoryQueryVariables {
  input: CategoryInput;
}
