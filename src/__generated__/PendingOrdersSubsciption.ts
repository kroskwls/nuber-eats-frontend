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

export interface PendingOrdersSubsciption_pendingOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: PendingOrdersSubsciption_pendingOrders_driver | null;
  customer: PendingOrdersSubsciption_pendingOrders_customer | null;
  restaurant: PendingOrdersSubsciption_pendingOrders_restaurant | null;
}

export interface PendingOrdersSubsciption {
  pendingOrders: PendingOrdersSubsciption_pendingOrders;
}
