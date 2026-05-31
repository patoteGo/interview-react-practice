# react-optimize-product-grid

Practice optimization: the product page does too much work on every render.

## Run

```bash
npm install
npm run dev
```

## What to observe

- Typing in search feels sluggish.
- Clicking `Unrelated counter` still re-runs expensive list work.
- Many product cards re-render even when their data did not change.
- Open the console to see `console.count` noise from card renders.

## Interview goal

Improve perceived performance without changing the feature set.

## Good directions

- Memoize expensive derived data.
- Avoid recreating handlers unnecessarily.
- Prevent unchanged cards from re-rendering.
- Optionally use React tools like `useMemo`, `useCallback`, `memo`, or `useDeferredValue`.
