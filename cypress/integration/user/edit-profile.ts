describe('Edit Profile', () => {
	const user = cy;

	beforeEach(() => {
		const email = 'test2@naver.com';
		const password = '12345';
		user.login(email, password);
	});

	it('can go to /edit-profile using the header', () => {
		user.get('a[href="/edit-profile"]').click();
		user.wait(1000);
		user.assertTitle('Edit Profile');
	});

	it('can change email', () => {
		user.interceptRequest('POST', 'EditProfileMutation', {
			email: 'test2@naver.com'
		});
		user.visit('/edit-profile');
		user.findByPlaceholderText('Email').clear().type('new@email.com');
		user.get('button').click();
	});
});