import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { LOCALSTORAGE_TOKEN, SERVER_URI } from './constants';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
	uri: `ws:${SERVER_URI}`,
	options: {
		reconnect: true,
		connectionParams: {
			'x-jwt': authTokenVar() || ''
		}
	}
});
const httpLink = createHttpLink({
	uri: `http://${SERVER_URI}`,
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