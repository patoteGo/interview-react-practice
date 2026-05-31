# Cypress Guided Examples

## API helper shape
```ts
const API_URL = 'http://localhost:4001/api/todos'

export async function fetchTodos() {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Failed to load todos')
  return response.json()
}
```

## Component skeleton
```tsx
export function TodoList() {
  // loading
  // error
  // data
  return <div>TODO</div>
}
```

## Test selector idea
```tsx
<button data-testid="todo-submit-button">Add</button>
<ul data-testid="todo-list">...</ul>
```

## First Cypress test shape
```ts
describe('todos flow', () => {
  it('creates a todo', () => {
    cy.visit('/')
    cy.get('[data-testid="todo-input"]').type('Learn Cypress')
    cy.get('[data-testid="todo-submit-button"]').click()
    cy.contains('Learn Cypress').should('be.visible')
  })
})
```

## States to build before testing
- loading
- success
- empty
- error
