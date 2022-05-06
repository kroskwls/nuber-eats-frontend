describe('Log In', () => {
	const user = cy;

	it('should see login page', () => {
		user.assertTitle('Login');
	});

	it('can see email & password validation errors', () => {
		user.visit('/');
		user.findByPlaceholderText('Email').type('wrong@test');
		user.findByRole('alert').should('have.text', 'Wrong email pattern');
		user.findByPlaceholderText('Email').clear();
		user.findByRole('alert').should('have.text', 'Email is required.');
		user.findByPlaceholderText('Email').type('right@test.com');
		user.findByPlaceholderText('Password').type('123').clear();
		user.findByRole('alert').should('have.text', 'Password is required.');
	});

	it('can fill out the form and log in', () => {
		user.login('test@naver.com', '12345');
	});
});