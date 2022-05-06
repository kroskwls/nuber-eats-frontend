/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOneOrderInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetOneOrderQuery
// ====================================================

export interface GetOneOrderQuery_getOneOrder_order_driver {
  __typename: "User";
  email: string;
}

export interface GetOneOrderQuery_getOneOrder_order_customer {
  __typename: "User";
  email: string;
}

export interface GetOneOrderQuery_getOneOrder_order_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface GetOneOrderQuery_getOneOrder_order {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: GetOneOrderQuery_getOneOrder_order_driver | null;
  customer: GetOneOrderQuery_getOneOrder_order_customer | null;
  restaurant: GetOneOrderQuery_getOneOrder_order_restaurant | null;
}

export interface GetOneOrderQuery_getOneOrder {
  __typename: "GetOneOrderOutput";
  ok: boolean;
  error: string | null;
  order: GetOneOrderQuery_getOneOrder_order | null;
}

export interface GetOneOrderQuery {
  getOneOrder: GetOneOrderQuery_getOneOrder;
}

export interface GetOneOrderQueryVariables {
  input: GetOneOrderInput;
}
