# react-bug-tabs-profile

Practice bug: quickly switching tabs can show stale profile data for the wrong tab.

## Run

```bash
npm install
npm run dev
```

## What to reproduce

1. Click `Ada`, `Grace`, and `Linus` quickly a few times.
2. Watch the selected tab label.
3. Sometimes the profile card shows data from a previous request instead of the latest tab.

## Interview goal

Fix the async race condition so only the latest selection can update the UI.

## Hints

- Check the `useEffect` that loads data.
- Think about what happens when older requests resolve after newer ones.
- A cleanup function or request tracking can help.
