describe('todos flow', () => {
	it('create a todo', () => {
		cy.visit('/')
		cy.get('[data-testid="todo-input"]').type('Learn Cypress5')
		cy.get('[data-testid="todo-submit-button"]').click()
		cy.contains('Learn Cypress').should('be.visible')
	})

	it('toggle a todo', () => {
		cy.visit('/')
		cy.contains('[data-testid^="todo-title-"]', 'Learn Cypress5')
			.closest('li')
			.find('input[type="checkbox"]')
			.click()
			.should('be.checked')

	})
})