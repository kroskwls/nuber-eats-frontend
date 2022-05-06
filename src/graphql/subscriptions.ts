import { gql } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "./fragments";

export const ORDER_SUBSCRIPTION = gql`
	subscription OrderUpdatesSubscription ($input: OrderUpdatesInput!) {
		orderUpdates (input: $input) {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

export const PENDING_ORDER_SUBSCRIPTION = gql`
	subscription PendingOrdersSubsciption {
		pendingOrders {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

export const COOKED_ORDER_SUBSCRIPTION = gql`
	subscription CookedOrderSubscription {
		cookedOrders {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;