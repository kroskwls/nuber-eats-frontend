/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: PendingOrdersSubsciption
// ====================================================

export interface PendingOrdersSubsciption_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface PendingOrdersSubsciption_pendingOrders_customer {
  __typename: "User";
  email: string;
}

export interface PendingOrdersSubsciption_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface PendingOrdersSubsciption_pendingOrders_items_dish {
  __typename: "Dish";
  name: string;
  photo: string | null;
}

export interface PendingOrdersSubsciption_pendingOrders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface PendingOrdersSubsciption_pendingOrders_items {
  __typename: "OrderItem";
  dish: PendingOrdersSubsciption_pendingOrders_items_dish;
  options: PendingOrdersSubsciption_pendingOrders_items_options[] | null;
}

export interface PendingOrdersSubsciption_pendingOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: PendingOrdersSubsciption_pendingOrders_driver | null;
  customer: PendingOrdersSubsciption_pendingOrders_customer | null;
  restaurant: PendingOrdersSubsciption_pendingOrders_restaurant | null;
  items: PendingOrdersSubsciption_pendingOrders_items[];
}

export interface PendingOrdersSubsciption {
  pendingOrders: PendingOrdersSubsciption_pendingOrders;
}
