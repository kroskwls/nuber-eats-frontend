module.exports = {
	client: {
		includes: [__dirname + '/src/graphql/*.ts'],
		tagName: 'gql',
		service: {
			name: 'nuber-eats-backend',
			url: 'http://192.168.06:4000/graphql'
		}
	}
};