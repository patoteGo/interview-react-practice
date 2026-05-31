# Vitest Practice Checklist

Use this file to repeat each exercise module on purpose.

Rule:
- do not paste a full solution
- type the code yourself
- after each round, delete and retype the key parts
- only move on when the current round feels boring

---

## How to use this checklist
For each function or module, do **3 rounds**:

### Round 1 — Guided
- read the relevant section in `IMPLEMENTATION-GUIDE.md`
- write the types
- write the tests
- write the implementation
- get tests green

### Round 2 — Reduced help
- hide most of the docs
- rebuild from memory
- only check docs when stuck
- compare what you forgot

### Round 3 — Recall
- start from a blank file
- write the tests from memory first
- implement with minimal backtracking
- explain out loud what each test proves

---

## Session tracker

### calculateLineTotal
- [ ] Round 1 complete
- [ ] Round 2 complete
- [ ] Round 3 complete
- [ ] I can explain the input/output shape without looking
- [ ] I can list the edge cases without looking

### calculateCartTotal
- [ ] Round 1 complete
- [ ] Round 2 complete
- [ ] Round 3 complete
- [ ] I can explain why this composes line totals
- [ ] I can explain empty cart behavior clearly

### applyDiscount
- [ ] Round 1 complete
- [ ] Round 2 complete
- [ ] Round 3 complete
- [ ] I can explain fixed vs percentage discount clearly
- [ ] I can explain how I prevent negative totals

### validateCheckout
- [ ] Round 1 complete
- [ ] Round 2 complete
- [ ] Round 3 complete
- [ ] I can explain my validation result shape clearly
- [ ] I can explain how multiple errors are returned

### optional async module or hook
- [ ] Round 1 complete
- [ ] Round 2 complete
- [ ] Round 3 complete
- [ ] I can explain what is mocked and why
- [ ] I can explain loading / success / error flow clearly

---

## Checklist by function

## 1) `calculateLineTotal`

### Before coding
- [ ] I know the function input type
- [ ] I know the function output type
- [ ] I decided what to do with invalid quantity
- [ ] I decided what to do with invalid price

### Tests to write
- [ ] normal case
- [ ] zero quantity
- [ ] negative quantity
- [ ] negative price
- [ ] optional rounding case

### After coding
- [ ] tests are green
- [ ] function stays small
- [ ] test names describe behavior
- [ ] I can rewrite it from memory

### Self-check questions
- [ ] Can I explain why this is a pure function?
- [ ] Can I explain why no mocks are needed?
- [ ] Can I explain what the boundary cases are?

---

## 2) `calculateCartTotal`

### Before coding
- [ ] I know whether this receives raw cart lines or precomputed totals
- [ ] I know how empty carts should behave
- [ ] I know whether invalid lines throw, skip, or fail validation earlier

### Tests to write
- [ ] empty cart returns expected value
- [ ] one item cart
- [ ] multiple item cart
- [ ] optional invalid line behavior

### After coding
- [ ] tests are green
- [ ] logic is easy to read
- [ ] implementation does one job only
- [ ] I can rewrite it from memory

### Self-check questions
- [ ] Can I explain how this composes smaller logic?
- [ ] Can I explain whether this should know about discounts?
- [ ] Can I explain why this should stay separate from validation?

---

## 3) `applyDiscount`

### Before coding
- [ ] I chose supported discount types
- [ ] I chose the discount input shape
- [ ] I decided how to guard against invalid discount values
- [ ] I decided whether total can ever go below zero

### Tests to write
- [ ] fixed discount case
- [ ] percentage discount case
- [ ] zero discount case
- [ ] discount larger than subtotal
- [ ] invalid discount input

### After coding
- [ ] tests are green
- [ ] rules are obvious from the tests
- [ ] negative totals are prevented
- [ ] I can rewrite it from memory

### Self-check questions
- [ ] Can I explain the business rule choices I made?
- [ ] Can I explain why these are unit tests and not integration tests?
- [ ] Can I explain the expected output for each discount type?

---

## 4) `validateCheckout`

### Before coding
- [ ] I chose the checkout input type
- [ ] I chose the validation result shape
- [ ] I know which fields are required
- [ ] I know whether errors are messages, codes, or both

### Tests to write
- [ ] valid checkout payload
- [ ] missing email
- [ ] invalid email format
- [ ] missing address fields
- [ ] empty cart
- [ ] invalid quantities
- [ ] multiple invalid fields at once

### After coding
- [ ] tests are green
- [ ] validation output is predictable
- [ ] rules are easy to extend
- [ ] I can rewrite it from memory

### Self-check questions
- [ ] Can I explain why returning structured errors helps testing?
- [ ] Can I explain the minimum valid payload?
- [ ] Can I explain how multiple failures are represented?

---

## 5) Optional async module or hook

### Before coding
- [ ] I chose plain async function or hook
- [ ] I know the dependency boundary I will mock
- [ ] I know the expected success shape
- [ ] I know the expected error behavior

### Tests to write
- [ ] success case
- [ ] failure case
- [ ] loading state if hook
- [ ] optional retry/refetch case
- [ ] optional malformed response case

### After coding
- [ ] tests are green
- [ ] only external boundary is mocked
- [ ] behavior is clearer than the implementation details
- [ ] I can rewrite it from memory

### Self-check questions
- [ ] Can I explain why mocking is useful here?
- [ ] Can I explain what stays real and what gets mocked?
- [ ] Can I explain the async flow clearly?

---

## End-of-round reflection
After each session, answer these:
- [ ] What part did I remember easily?
- [ ] What part did I have to look up?
- [ ] Which test case did I forget?
- [ ] Which type shape was unclear?
- [ ] What will I retype tomorrow?

---

## Graduation checklist
- [ ] I can write a tiny pure-function Vitest test from memory
- [ ] I can design inputs before implementation
- [ ] I can list edge cases before coding
- [ ] I know when not to mock
- [ ] I know when mocking is appropriate
- [ ] I can refactor with confidence because the tests protect behavior
