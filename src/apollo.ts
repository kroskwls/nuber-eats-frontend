import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { DEV_URI, LOCALSTORAGE_TOKEN, PROD_URI } from './constants';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
	uri: process.env.NODE_ENV === 'production' ? `ws:${PROD_URI}/graphql` : `ws:${DEV_URI}/graphql`,
	options: {
		reconnect: true,
		connectionParams: {
			'x-jwt': authTokenVar() || ''
		}
	}
});
const httpLink = createHttpLink({
	uri: process.env.NODE_ENV === 'production' ? `https://${PROD_URI}/graphql` : `http://${DEV_URI}/graphql`,
});
const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			'x-jwt': authTokenVar() || ""
		}
	}
});
// 1번째 파라미터 함수가 
// true를 반환하는 경우 2번째 파라미터를 사용
// false를 반환하는 경우 3번째 파라미터를 사용
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	authLink.concat(httpLink)
);

export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					isLoggedIn: {
						read() {
							return isLoggedInVar();
						}
					},
					token: {
						read() {
							return authTokenVar();
						}
					}
				}
			}
		}
	})
});