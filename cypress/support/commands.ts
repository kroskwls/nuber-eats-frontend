// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

declare global {
	namespace Cypress {
		interface Chainable {
			assertLoggedIn(): void;
			assertLoggedOut(): void;
			assertTitle(name: string): void;
			login(email: string, password: string): void;
			interceptResponse(name: string, fixture: string): void;
			interceptRequest(method: string, name: string, input: any): void;
		}
	}
}

Cypress.Commands.add('assertLoggedIn', () => {
	cy.window().its('localStorage.nuber-token').should('be.a', 'string');
});

Cypress.Commands.add('assertLoggedOut', () => {
	cy.window().its('localStorage.nuber-token').should('be.undefined');
});

Cypress.Commands.add('login', (email, password) => {
	cy.visit('/');
	cy.assertLoggedOut();
	cy.assertTitle('Login');
	cy.findByPlaceholderText('Email').type(email);
	cy.findByPlaceholderText('Password').type(password);
	cy.findByRole('button').should('not.have.class', 'pointer-event-none').click();
	cy.assertLoggedIn();
});

Cypress.Commands.add('assertTitle', (name) => {
	cy.title().should('eq', `${name} | Nuber Eats`);
});

Cypress.Commands.add('interceptResponse', (name, fixture) => {
	cy.intercept('http://localhost:4000/graphql', (req) => {
		const { operationName } = req.body;
		if (operationName && operationName === name) {
			req.reply((res) => {
				res.send({ fixture });
			});
		}
	});
});

Cypress.Commands.add('interceptRequest', (method, name, input) => {
	// @ts-ignore
	cy.intercept(method, 'http://localhost:4000/graphql', (req) => {
		const { operationName } = req.body;
		if (operationName && operationName === name) {
			req.body.variables.input = input;
		}
	});
});