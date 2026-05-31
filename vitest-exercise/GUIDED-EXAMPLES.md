# Vitest Guided Examples

This file gives you **code-shaped guidance**.

It is not the full solution.
It is meant to show you:
- what the files can look like
- how to shape the types
- how to shape the tests
- how to think through the implementation

Use this when `IMPLEMENTATION-GUIDE.md` feels too abstract.

---

## Big picture
You are building small business-logic modules and testing them with Vitest.

The flow should feel like this:

1. define the type
2. write one small test
3. write the smallest implementation
4. run tests
5. add one edge case
6. refactor safely

```
Define types  →  Write test  →  Implement smallest logic
      ↑                                      ↓
 Refactor  ←  Add edge case  ←  Run Vitest
```

---

## 1) Types first

Start by creating a type file.

Suggested file:
- `src/exercise/cart/types.ts`

Example shape:

```ts
export type CartLine = {
  id: string
  name: string
  price: number
  quantity: number
}

export type Discount =
  | { type: 'fixed'; amount: number }
  | { type: 'percentage'; amount: number }
```

Why this helps:
- your tests get clear inputs
- your functions become easier to reason about
- TypeScript helps you stay consistent

---

## 2) First pure function: `calculateLineTotal`

Suggested file:
- `src/exercise/cart/calculateLineTotal.ts`

A good first version can be tiny.

### Function shape

```ts
import type { CartLine } from './types'

export function calculateLineTotal(line: CartLine): number {
  // TODO: implement
  return 0
}
```

That is intentionally incomplete.
Now write tests before filling it in.

### Test file shape

Suggested file:
- `src/exercise/cart/calculateLineTotal.test.ts`

```ts
import { describe, expect, it } from 'vitest'
import { calculateLineTotal } from './calculateLineTotal'

describe('calculateLineTotal', () => {
  it('multiplies price by quantity', () => {
    const line = {
      id: '1',
      name: 'Keyboard',
      price: 50,
      quantity: 2,
    }

    const result = calculateLineTotal(line)

    expect(result).toBe(100)
  })
})
```

### What you do next
After the first test exists, implement the smallest logic that makes it pass.

That implementation will probably be mentally obvious.
Do it yourself.

### Then add edge cases
Add tests like these:

```ts
it('returns 0 when quantity is 0', () => {
  const line = {
    id: '1',
    name: 'Keyboard',
    price: 50,
    quantity: 0,
  }

  const result = calculateLineTotal(line)

  expect(result).toBe(0)
})
```

Then decide your rule for invalid values.
For example, if you want negative quantity to fail:

```ts
it('throws when quantity is negative', () => {
  const line = {
    id: '1',
    name: 'Keyboard',
    price: 50,
    quantity: -1,
  }

  expect(() => calculateLineTotal(line)).toThrow()
})
```

### What you are learning here
- tiny function
- tiny test
- direct input/output
- no mocks
- one behavior at a time

---

## 3) Compose logic: `calculateCartTotal`

Suggested file:
- `src/exercise/cart/calculateCartTotal.ts`

### Function shape

```ts
import type { CartLine } from './types'

export function calculateCartTotal(lines: CartLine[]): number {
  // TODO: implement
  return 0
}
```

### First tests

```ts
import { describe, expect, it } from 'vitest'
import { calculateCartTotal } from './calculateCartTotal'

describe('calculateCartTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateCartTotal([])).toBe(0)
  })

  it('sums multiple cart lines', () => {
    const lines = [
      { id: '1', name: 'Keyboard', price: 50, quantity: 2 },
      { id: '2', name: 'Mouse', price: 25, quantity: 1 },
    ]

    expect(calculateCartTotal(lines)).toBe(125)
  })
})
```

### Important design question
Should this function:
- multiply price × quantity itself, or
- reuse `calculateLineTotal`?

Best learning move: reuse the smaller function.
That teaches composition.

Mental model:

```
CartLine[]
    │
    ▼
calculateLineTotal for each line
    │
    ▼
sum results
    │
    ▼
cart total
```

---

## 4) Business rules: `applyDiscount`

Suggested file:
- `src/exercise/cart/applyDiscount.ts`

### Function shape

```ts
import type { Discount } from './types'

export function applyDiscount(subtotal: number, discount?: Discount): number {
  // TODO: implement
  return subtotal
}
```

### Suggested tests

```ts
import { describe, expect, it } from 'vitest'
import { applyDiscount } from './applyDiscount'

describe('applyDiscount', () => {
  it('applies a fixed discount', () => {
    const result = applyDiscount(100, { type: 'fixed', amount: 10 })

    expect(result).toBe(90)
  })

  it('applies a percentage discount', () => {
    const result = applyDiscount(100, { type: 'percentage', amount: 20 })

    expect(result).toBe(80)
  })

  it('does not go below 0', () => {
    const result = applyDiscount(10, { type: 'fixed', amount: 50 })

    expect(result).toBe(0)
  })
})
```

### Your thinking job
Decide these rules before coding:
- Is percentage `20` or `0.2`?
- Should invalid discounts throw?
- Should negative subtotal be allowed?
- Should you round to 2 decimals?

That decision work is part of the exercise.

---

## 5) Structured validation: `validateCheckout`

Suggested file:
- `src/exercise/checkout/types.ts`
- `src/exercise/checkout/validateCheckout.ts`

### Example type shape

```ts
import type { CartLine } from '../cart/types'

export type CheckoutInput = {
  email: string
  fullName: string
  address: string
  lines: CartLine[]
}

export type ValidationResult = {
  isValid: boolean
  errors: string[]
}
```

This is a simple version.
You can make it more advanced later.

### Validator shape

```ts
import type { CheckoutInput, ValidationResult } from './types'

export function validateCheckout(input: CheckoutInput): ValidationResult {
  const errors: string[] = []

  // TODO: add rules

  return {
    isValid: errors.length === 0,
    errors,
  }
}
```

### First tests

```ts
import { describe, expect, it } from 'vitest'
import { validateCheckout } from './validateCheckout'

const validInput = {
  email: 'pat@example.com',
  fullName: 'Pat Doe',
  address: '123 Main St',
  lines: [{ id: '1', name: 'Keyboard', price: 50, quantity: 2 }],
}

describe('validateCheckout', () => {
  it('returns valid for a correct payload', () => {
    expect(validateCheckout(validInput)).toEqual({
      isValid: true,
      errors: [],
    })
  })

  it('returns an error when email is missing', () => {
    const result = validateCheckout({
      ...validInput,
      email: '',
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Email is required')
  })
})
```

### Then add more rules
Add tests for:
- invalid email format
- empty address
- empty lines array
- quantity less than 1
- multiple errors at once

### Why this is useful
You learn that structured return values are easier to test than vague booleans.

Bad:

```ts
return false
```

Better:

```ts
return {
  isValid: false,
  errors: ['Email is required', 'Address is required'],
}
```

---

## 6) Optional async example

If you want one async step, start with a plain function before a hook.

Suggested file:
- `src/exercise/orders/fetchOrderSummary.ts`

### Function shape

```ts
export async function fetchOrderSummary(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch order summary')
  }

  return response.json()
}
```

### Test shape

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchOrderSummary } from './fetchOrderSummary'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchOrderSummary', () => {
  it('returns parsed json on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'order-1', total: 120 }),
    } as Response)

    await expect(fetchOrderSummary('order-1')).resolves.toEqual({
      id: 'order-1',
      total: 120,
    })
  })

  it('throws on failed response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response)

    await expect(fetchOrderSummary('order-1')).rejects.toThrow(
      'Failed to fetch order summary',
    )
  })
})
```

### What this teaches
- async assertions
- mocking a boundary
- not mocking your own business logic

---

## 7) A very simple test-writing template

When you feel lost, use this exact shape:

```ts
import { describe, expect, it } from 'vitest'
import { thingToTest } from './thingToTest'

describe('thingToTest', () => {
  it('does one specific behavior', () => {
    // Arrange
    const input = undefined

    // Act
    const result = thingToTest(input)

    // Assert
    expect(result).toBe(undefined)
  })
})
```

Replace one piece at a time.

---

## 8) A very simple implementation template

```ts
export function thingToTest(input: unknown) {
  // guard clause first if needed

  // main behavior next

  // return result
}
```

Good first pass:
- no clever abstractions
- no big helpers too early
- make it pass
- then clean it up

---

## 9) What to do when you get stuck

If you do not know what code to write next:

1. open the test file
2. write the test name in plain English
3. create the smallest input object possible
4. write the expected result
5. only then open the implementation file

Example:

```ts
it('returns 0 for an empty cart', () => {
  expect(calculateCartTotal([])).toBe(0)
})
```

That kind of test tells you almost the entire implementation direction.

---

## 10) Your actual path from here

Do this in order:

1. create `src/exercise/cart/types.ts`
2. create `calculateLineTotal.ts`
3. create `calculateLineTotal.test.ts`
4. make first test pass
5. add 2-3 edge cases
6. move to `calculateCartTotal`
7. move to `applyDiscount`
8. move to `validateCheckout`
9. only then try async work

---

## 11) Ask me for targeted help like this

Good follow-up asks:
- “show me how to shape the types for `validateCheckout`”
- “give me 5 edge cases for `applyDiscount`”
- “review my `calculateCartTotal` test names”
- “help me test thrown errors in Vitest”
- “explain `vi.spyOn` with this fetch example”

If you want, next I can also create **comment-only starter files** for each Vitest exercise file so you have code structure but still write the real logic yourself.
