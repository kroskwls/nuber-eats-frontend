/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderUpdatesInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OrderUpdatesSubscription
// ====================================================

export interface OrderUpdatesSubscription_orderUpdates_driver {
  __typename: "User";
  email: string;
}

export interface OrderUpdatesSubscription_orderUpdates_customer {
  __typename: "User";
  email: string;
}

export interface OrderUpdatesSubscription_orderUpdates_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface OrderUpdatesSubscription_orderUpdates_items_dish {
  __typename: "Dish";
  name: string;
  photo: string | null;
}

export interface OrderUpdatesSubscription_orderUpdates_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface OrderUpdatesSubscription_orderUpdates_items {
  __typename: "OrderItem";
  dish: OrderUpdatesSubscription_orderUpdates_items_dish;
  options: OrderUpdatesSubscription_orderUpdates_items_options[] | null;
}

export interface OrderUpdatesSubscription_orderUpdates {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: OrderUpdatesSubscription_orderUpdates_driver | null;
  customer: OrderUpdatesSubscription_orderUpdates_customer | null;
  restaurant: OrderUpdatesSubscription_orderUpdates_restaurant | null;
  items: OrderUpdatesSubscription_orderUpdates_items[];
}

export interface OrderUpdatesSubscription {
  orderUpdates: OrderUpdatesSubscription_orderUpdates;
}

export interface OrderUpdatesSubscriptionVariables {
  input: OrderUpdatesInput;
}
