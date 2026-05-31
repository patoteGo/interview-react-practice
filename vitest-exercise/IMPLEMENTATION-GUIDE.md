# Vitest Exercise Implementation Guide

## What I prepared for you
This folder already has the setup work done:
- Vite + React + TypeScript
- Vitest configured
- jsdom configured
- Testing Library installed
- a tiny app shell so the project runs

That means **you should focus on the exercise code and the tests**, not on boilerplate.

If you want more hand-holding while typing, open `GUIDED-EXAMPLES.md` alongside this file.
It includes code-shaped examples, test templates, and partial implementations.

---

## Your actual assignment
Implement and test **three layers**, in this order:

1. **Pure utility functions**
2. **A small domain module**
3. **One optional React hook or component test**

Start small. Do not jump to React tests first.

---

## Recommended exercise theme
Use a **shopping cart / checkout** domain because it gives you easy inputs, outputs, and edge cases.

You should create code for these kinds of behaviors:

### 1) Money and cart calculations
Suggested files:
- `src/exercise/cart/types.ts`
- `src/exercise/cart/calculateLineTotal.ts`
- `src/exercise/cart/calculateCartTotal.ts`
- `src/exercise/cart/applyDiscount.ts`

Suggested responsibilities:
- calculate a single line total from price × quantity
- sum multiple cart lines
- apply a percentage or fixed discount
- prevent invalid totals like negative final amounts

### 2) Checkout validation
Suggested files:
- `src/exercise/checkout/types.ts`
- `src/exercise/checkout/validateCheckout.ts`

Suggested responsibilities:
- validate email
- validate required shipping fields
- validate quantity rules
- return structured errors, not just `true` / `false`

### 3) Optional async layer
Suggested files:
- `src/exercise/orders/fetchOrderSummary.ts`
- `src/exercise/hooks/useOrderSummary.ts`

Suggested responsibilities:
- fetch order summary data
- expose loading, success, and error states
- optionally test retry or refresh behavior

If that feels like too much, stop after layers 1 and 2.

---

## Exact learning target by layer

## Layer 1 — Pure functions
This is where you learn:
- happy-path assertions
- edge-case assertions
- parameterized tests
- boundary values

### Implement functions like
- line total calculator
- cart subtotal calculator
- discount application

### Questions your tests should answer
- what happens with quantity `0`?
- what happens with negative price or quantity?
- what happens with an empty cart?
- what happens when discount is larger than subtotal?
- should values be rounded?

### What good tests look like here
- one behavior per test
- very small input objects
- no mocks
- direct output assertions

---

## Layer 2 — Domain validation
This is where you learn:
- behavior-driven test names
- multiple invalid cases
- structured return values
- test coverage for rules, not implementation details

### Implement a validator that checks
- email exists and looks valid
- full name is required
- address is required
- at least one line item exists
- quantities are positive integers

### Return shape idea
You can choose your own shape, but keep it predictable.
For example, think in terms of:
- `isValid`
- `errors`
- maybe field-specific keys

### Questions your tests should answer
- how many errors are returned for multiple invalid fields?
- can validation fail in more than one place at once?
- what is the minimum valid payload?
- do you return stable error messages or stable error codes?

---

## Layer 3 — Optional async module or hook
This is where you learn:
- async tests
- mocks and spies
- loading/error/success thinking
- when to isolate dependencies

### If you test a plain async function
Start with:
- success case
- rejected request case
- malformed response case

### If you test a hook
Focus on:
- initial loading state
- success transition
- error transition
- optional refetch/retry

### What to mock
Mock the network boundary, not your own business logic.

---

## Suggested file structure
```text
vitest-exercise/
  src/
    exercise/
      cart/
        types.ts
        calculateLineTotal.ts
        calculateCartTotal.ts
        applyDiscount.ts
      checkout/
        types.ts
        validateCheckout.ts
      orders/
        fetchOrderSummary.ts
      hooks/
        useOrderSummary.ts
    test/
      setup.ts
```

You can place tests either:
- next to the source files, or
- under a dedicated test folder

Example naming:
- `calculateLineTotal.test.ts`
- `calculateCartTotal.test.ts`
- `validateCheckout.test.ts`
- `useOrderSummary.test.ts`

---

## Recommended implementation order

### Step 1
Create your domain types first.

Why:
- clear inputs make tests easier to write
- type shapes force you to define the problem before coding logic

### Step 2
Write one tiny pure function.

Start with the smallest possible target:
- line total from price and quantity

Then write tests for:
- normal case
- zero quantity
- invalid quantity

### Step 3
Build cart total from line totals.

Tests should prove:
- empty cart behavior
- multiple line sum
- invalid lines handling if you decide to guard against them

### Step 4
Add discount logic.

Decide now:
- fixed discount or percentage or both
- can final total go below zero?
- how do you handle invalid codes or invalid values?

### Step 5
Add checkout validation.

Start with one valid payload and one invalid payload.
Then expand into multiple invalid combinations.

### Step 6
Only after that, add async code or hook tests.

---

## How to write the tests
Use this thought process every time:

1. what is the behavior?
2. what are the inputs?
3. what is the expected output?
4. what is the edge case?
5. do I need a mock at all?

### Pattern to repeat
```text
Arrange
- create the smallest input that proves the behavior

Act
- call the function once

Assert
- check only the output or visible side effect relevant to that behavior
```

---

## Example behaviors to cover

## `calculateLineTotal`
- multiplies price by quantity
- returns zero for zero quantity if allowed
- rejects negative quantity
- rejects negative price

## `calculateCartTotal`
- sums multiple lines
- returns zero for empty cart
- handles one-line cart correctly

## `applyDiscount`
- subtracts fixed discount
- applies percent discount
- does not go below zero
- handles unknown or invalid discount input

## `validateCheckout`
- passes valid checkout data
- fails missing email
- fails invalid email format
- fails empty address
- fails empty cart
- returns multiple errors when multiple fields are wrong

## `useOrderSummary` or async module
- starts loading
- resolves with data
- exposes error state on failure
- optionally retries or refetches

---

## What not to do
- do not start with a huge all-in-one function
- do not mock everything by default
- do not test internal variable names
- do not write giant tests covering 5 behaviors at once
- do not jump to React component tests before pure logic feels easy

---

## Good stopping points
You can stop after any of these and still get value:

### Stop point A
- line total tests
- cart total tests

### Stop point B
- add discount logic
- add validation tests

### Stop point C
- add one async function or hook test

---

## Commands
```bash
cd vitest-exercise
npm install
npm run dev
npm run test
npm run test:watch
```

---

## Final success criteria
You are done when you can:
- create a tiny module and write tests without setup confusion
- explain why a case is unit-tested
- tell when mocking is necessary
- write happy-path and edge-case tests from memory
- refactor the implementation while keeping tests green
