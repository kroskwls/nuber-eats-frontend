/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: FullOrderParts
// ====================================================

export interface FullOrderParts_driver {
  __typename: "User";
  email: string;
}

export interface FullOrderParts_customer {
  __typename: "User";
  email: string;
}

export interface FullOrderParts_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface FullOrderParts_items_dish {
  __typename: "Dish";
  name: string;
}

export interface FullOrderParts_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface FullOrderParts_items {
  __typename: "OrderItem";
  dish: FullOrderParts_items_dish;
  options: FullOrderParts_items_options[] | null;
}

export interface FullOrderParts {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: FullOrderParts_driver | null;
  customer: FullOrderParts_customer | null;
  restaurant: FullOrderParts_restaurant | null;
  items: FullOrderParts_items[];
}
