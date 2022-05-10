const uri = process.env.NODE_ENV === 'production' ? 'https://nuber-eats-backend-krosk.herokuapp.com' : 'http://localhost:4000';

module.exports = {
	client: {
		includes: [__dirname + '/src/graphql/*.ts'],
		tagName: 'gql',
		service: {
			name: 'nuber-eats-backend',
			url: `${uri}/graphql`
		}
	}
};