/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: CookedOrderSubscription
// ====================================================

export interface CookedOrderSubscription_cookedOrders_driver {
  __typename: "User";
  email: string;
}

export interface CookedOrderSubscription_cookedOrders_customer {
  __typename: "User";
  email: string;
}

export interface CookedOrderSubscription_cookedOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface CookedOrderSubscription_cookedOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: CookedOrderSubscription_cookedOrders_driver | null;
  customer: CookedOrderSubscription_cookedOrders_customer | null;
  restaurant: CookedOrderSubscription_cookedOrders_restaurant | null;
}

export interface CookedOrderSubscription {
  cookedOrders: CookedOrderSubscription_cookedOrders;
}
