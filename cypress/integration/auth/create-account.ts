describe('Create Account', () => {
	const user = cy;

	it('should see email & password validation errors', () => {
		user.visit('/');
		user.findByText('Create an Account').click();
		user.findByPlaceholderText('Email').type('wrong@test');
		user.findByRole('alert').should('have.text', 'Wrong email pattern.');
		user.findByPlaceholderText('Email').clear();
		user.findByRole('alert').should('have.text', 'Email is required.');
		user.findByPlaceholderText('Email').type('right@test.com');
		user.findByPlaceholderText('Password').type('123').clear();
		user.findByRole('alert').should('have.text', 'Password is required.');
	});

	it('should be able to create account', () => {
		user.interceptResponse('CreateAccountMutation', 'auth/create-account.json');
		const email = 'test@naver.com';
		const password = '12345';
		user.visit('/create-account');
		user.findByPlaceholderText('Email').type(email);
		user.findByPlaceholderText('Password').type(password);
		user.findByRole('button').click();
		user.wait(1000);
		user.login(email, password);
	});
});