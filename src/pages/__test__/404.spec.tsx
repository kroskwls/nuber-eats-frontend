import { waitFor } from '@testing-library/react';
import React from 'react';
import { render } from '../../test-utils';
import { NotFound } from '../404';

describe('<NotFound />', () => {
	it('render OK with title', async () => {
		render(<NotFound />);
		await waitFor(() => {
			expect(document.title).toBe('Not Found | Nuber Eats');
		});
	});
});