# react-bug-checkout-form

Practice bug: a checkout cart row keeps the wrong quantity/total after removing another row.

## Run

```bash
npm install
npm run dev
```

## What to reproduce

1. Change the quantity of `Paper Filters` to `5`.
2. Remove `Coffee Beans`.
3. Notice the quantity input and line total now belong to the wrong item.

## Interview goal

Fix the bug without rewriting the whole app.

## Hints

- Look at how each row is keyed.
- Check where row state lives and how it is initialized.
- Make sure the rendered row identity matches the actual product identity.
