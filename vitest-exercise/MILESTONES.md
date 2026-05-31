# Vitest Milestones

## Level 0 — Setup is already done
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Run `npm run test`
- [ ] Confirm you understand the scaffold before coding exercise logic

## Level 1 — Define the problem clearly
- [ ] Create domain types for cart items and checkout input
- [ ] Decide how money, quantities, and errors should be represented
- [ ] Pick your return shapes before implementation
- [ ] Read `IMPLEMENTATION-GUIDE.md`

## Level 2 — First pure function
- [ ] Implement `calculateLineTotal`
- [ ] Write tests for normal case
- [ ] Write tests for zero or invalid quantity
- [ ] Keep the function and tests tiny

## Level 3 — Compose logic
- [ ] Implement `calculateCartTotal`
- [ ] Test empty cart
- [ ] Test one-line cart
- [ ] Test multiple-line cart

## Level 4 — Add business rules
- [ ] Implement `applyDiscount`
- [ ] Test fixed discount
- [ ] Test percentage discount
- [ ] Test that totals never go negative

## Level 5 — Validation thinking
- [ ] Implement `validateCheckout`
- [ ] Test valid checkout payload
- [ ] Test missing required fields
- [ ] Test multiple invalid fields returned at once

## Level 6 — Optional async practice
- [ ] Add async order summary function or hook
- [ ] Test loading / success / error states
- [ ] Mock the network boundary only
- [ ] Keep business logic unmocked

## Graduation check
- [ ] You can explain the types before coding the logic
- [ ] You can write unit tests from memory
- [ ] You know when mocking helps and when it hurts
- [ ] You can refactor safely with green tests
