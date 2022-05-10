module.exports = {
	client: {
		includes: [__dirname + '/src/graphql/*.ts'],
		tagName: 'gql',
		service: {
			name: 'nuber-eats-backend',
			url: 'http://localhost:4000/graphql'
		}
	}
};