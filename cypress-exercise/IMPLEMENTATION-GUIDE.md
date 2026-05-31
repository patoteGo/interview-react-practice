# Cypress Exercise Implementation Guide

## What is already done for you
- React + Vite + TypeScript scaffold
- sample API server at `http://localhost:4001`
- Cypress config and folder structure

## Read these in order
1. `INSTRUCTIONS.md`
2. `IMPLEMENTATION-GUIDE.md`
3. `GUIDED-EXAMPLES.md`
4. `PRACTICE-CHECKLIST.md`
5. `MILESTONES.md`

## Your assignment
Build a todo-style app and then automate it with Cypress.

Suggested files to create:
- `src/exercise/api/todosApi.ts`
- `src/exercise/state/useTodos.ts`
- `src/exercise/components/TodoForm.tsx`
- `src/exercise/components/TodoList.tsx`
- `src/exercise/components/TodoItem.tsx`
- `cypress/e2e/todos.cy.ts`

## Recommended order
1. Run the API server
2. Build loading state
3. Fetch and render todo list
4. Add create flow
5. Add done-toggle flow
6. Add stable `data-testid` attributes
7. Write Cypress happy-path test
8. Add empty/error tests

## Sample backend routes
- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/:id`

## Real learning targets
- stable selectors
- visible assertions
- app state + network together
- test isolation and deterministic flows
