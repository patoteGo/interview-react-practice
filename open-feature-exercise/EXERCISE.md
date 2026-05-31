# 🚀 OpenFeature Exercise — Guided Walkthrough

Read this file top-to-bottom. Each step builds on the last.
After every step, **run `npm run dev`** and verify in the browser.

---

## Architecture Overview

```
main.tsx
  └─ initFlags()           ← registers provider with OpenFeature singleton
  └─ <OpenFeatureProvider> ← React context that binds client to the tree
       └─ <App>
            └─ <FlagDashboard />   ← dev tool, shows flag states
            └─ <NewsFeed />        ← string variant flag (list vs card)
            └─ <PointsColumn />    ← boolean flag (show/hide)
            └─ <BetaSearch />      ← boolean + context (admin only)
            └─ <PricingCard />     ← string variant (pricing tier)
```

```
src/exercise/
├── flags/
│   └── flagKeys.ts           ← Step 1: flag name constants
├── provider/
│   └── createFlagsProvider.ts ← Step 2: InMemoryProvider config
├── evaluationContext.tsx      ← Step 5: user/role context (Level 3)
└── components/
    ├── FlagDashboard.tsx      ← dev tool (read-only, learn from it)
    ├── NewsFeed.tsx           ← Step 3: string variant flag
    ├── PointsColumn.tsx       ← Step 3: boolean flag
    ├── BetaSearch.tsx         ← Step 4: boolean + context
    └── PricingCard.tsx        ← Step 4: string variant (business logic)
```

---

## Step 0 — Verify the scaffold runs

```bash
cd open-feature-exercise
npm install
npm run dev
```

You should see a dark-themed page with:
- A "Feature Flag Playground" heading
- A Flag Dashboard table (all flags say "not registered" — that's expected!)
- Components showing hardcoded fallback values

✅ **Check**: App renders without errors. Dashboard shows "not registered" for all flags.

---

## Step 1 — Define flag keys

📄 **File**: `src/exercise/flags/flagKeys.ts`

**What to do**: Uncomment the flag keys inside `BooleanFlags` and `StringFlags`.

```ts
export const BooleanFlags = {
  showPoints: 'showPoints',
  enableBetaSearch: 'enableBetaSearch',
} as const;

export const StringFlags = {
  useNewCheckout: 'useNewCheckout',
  pricingVariant: 'pricingVariant',
} as const;
```

Also uncomment the `ALL_FLAG_KEYS` array entries.

**Why**: Centralizing flag keys prevents typos and gives you auto-complete.
Every component imports from this single file.

✅ **Check**: TypeScript compiles. No runtime change yet (flags still aren't registered).

---

## Step 2 — Create the provider and wire it up

📄 **Files**:
- `src/exercise/provider/createFlagsProvider.ts`
- `src/main.tsx`

### 2a — Define the flag configuration

In `createFlagsProvider.ts`, uncomment the `showPoints` flag in `flagConfig`:

```ts
const flagConfig = {
  showPoints: {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: 'off',   // ← SAFEST: hidden by default
  },
} as const;
```

Then uncomment `initFlags()`:

```ts
export function initFlags() {
  OpenFeature.setProvider(new InMemoryProvider(flagConfig));
}
```

### 2b — Call init and wrap the app

In `main.tsx`:

```tsx
import { initFlags } from './exercise/provider/createFlagsProvider'
initFlags();

import { OpenFeatureProvider } from '@openfeature/react-sdk'

// Wrap <App /> with the provider:
<OpenFeatureProvider>
  <App />
</OpenFeatureProvider>
```

**Key concept**: `OpenFeature.setProvider()` registers the provider globally.
`<OpenFeatureProvider>` is the React context that makes hooks work.

✅ **Check**: Flag Dashboard now shows `showPoints = false` with reason `STATIC`.

---

## Step 3 — Read your first flag in a component

📄 **File**: `src/exercise/components/PointsColumn.tsx`

Uncomment the imports and the hook call:

```tsx
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { BooleanFlags } from '../flags/flagKeys';

export function PointsColumn() {
  const showPoints = useBooleanFlagValue(BooleanFlags.showPoints, false);
  // ... rest stays the same
```

Delete the hardcoded `const showPoints = false;` line.

**Now test the flag**: In `createFlagsProvider.ts`, change `defaultVariant: 'off'` to `defaultVariant: 'on'`.

✅ **Check**: 
- `off` → "Points program is currently unavailable"
- `on` → "1,247 points earned this month"

Change it back to `'off'` after verifying.

---

## Step 4 — Add more flags

📄 **File**: `src/exercise/provider/createFlagsProvider.ts`

Uncomment the remaining flags one at a time. After each, update the component.

### 4a — NewsFeed (string variant)

Uncomment `useNewCheckout` in `flagConfig`. Then in `NewsFeed.tsx`:

```tsx
import { useStringFlagValue } from '@openfeature/react-sdk';
import { StringFlags } from '../flags/flagKeys';

const layout = useStringFlagValue(StringFlags.useNewCheckout, 'list');
```

Replace the hardcoded `const layout = 'list';` and build the conditional rendering
(list vs card grid).

### 4b — BetaSearch (boolean)

Uncomment `enableBetaSearch` in `flagConfig`. Then in `BetaSearch.tsx`:

```tsx
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import { BooleanFlags } from '../flags/flagKeys';

const enabled = useBooleanFlagValue(BooleanFlags.enableBetaSearch, false);
```

### 4c — PricingCard (string variant — business logic)

Uncomment `pricingVariant` in `flagConfig`. Then in `PricingCard.tsx`:

```tsx
import { useStringFlagValue } from '@openfeature/react-sdk';
import { StringFlags } from '../flags/flagKeys';

const variant = useStringFlagValue(StringFlags.pricingVariant, 'default');
```

**Test**: Change `pricingVariant`'s `defaultVariant` between `'default'`, `'discount'`, `'premium'`
and watch the pricing change.

⚠️ **Think about it**: What if `'discount'` was the default and the provider crashed?
Everyone gets half-price. That's why `'default'` (standard pricing) is the safest fallback.

✅ **Check**: All 4 flags appear in the Dashboard. Each component responds to config changes.

---

## Step 5 — Add evaluation context (Level 3)

📄 **Files**:
- `src/exercise/evaluationContext.tsx`
- `src/exercise/provider/createFlagsProvider.ts`
- `src/main.tsx`

### 5a — Uncomment the OpenFeature.setContext line

In `evaluationContext.tsx`, uncomment the `OpenFeature.setContext(...)` line inside `updateContext`.

### 5b — Add contextEvaluator to enableBetaSearch

In `createFlagsProvider.ts`, uncomment the `contextEvaluator`:

```ts
enableBetaSearch: {
  disabled: false,
  variants: { on: true, off: false },
  defaultVariant: 'off',
  contextEvaluator: (ctx: EvaluationContext) => {
    return ctx.role === 'admin' ? 'on' : 'off';
  },
},
```

### 5c — Wire context into the app

In `main.tsx`:

```tsx
import { AppContextProvider } from './exercise/evaluationContext.tsx'

// Wrap the tree:
<AppContextProvider>
  <OpenFeatureProvider>
    <App />
  </OpenFeatureProvider>
</AppContextProvider>
```

### 5d — Test it

BetaSearch should now only show for admins. The `FlagDashboard` shows
`TARGETING_MATCH` as the reason when the rule matches.

To switch roles, you'd call `useAppContext().setCtx({ ... })` —
add a small role-switcher component if you want to test interactively.

✅ **Check**: 
- Guest → BetaSearch hidden
- Admin → BetaSearch visible, reason = TARGETING_MATCH

---

## 🎯 You're done when

- [ ] You can explain **provider vs consumer** (who owns flag logic vs who reads it)
- [ ] You can explain **why defaults matter** (safest behavior when things break)
- [ ] You can **add a new flag** without confusion (key → config → hook → UI)
- [ ] You can describe **where targeting context belongs** (provider, not component)

---

## 🔁 Repetition drill

If you want to really internalize this, repeat from scratch:

1. Delete everything in `src/exercise/` except `README.md`
2. Rebuild: key → provider → hook → component
3. Time yourself. Aim for < 10 minutes

---

## 📚 Key concepts summary

| Concept | One-liner |
|---|---|
| **Provider** | Source of truth for flag values (InMemory, LaunchDarkly, etc.) |
| **Flag evaluation** | Asking "what value should this flag be right now?" |
| **Default value** | Fallback when provider fails or flag is missing — always pick safest |
| **Targeting context** | "Who is asking?" — user role, environment, device, etc. |
| **Variant** | Named option in a flag (`on`/`off`, `list`/`card`, etc.) |
| **Reason** | Why the flag got that value (`STATIC`, `DEFAULT`, `TARGETING_MATCH`) |
| **Progressive delivery** | Ship code hidden, expose gradually via flags |
