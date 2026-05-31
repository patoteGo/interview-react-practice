# OpenFeature — What I Learned

## Core Concepts

### Provider vs Consumer

- **Provider** = source of truth for flag values. Owns the logic.
  - In prod: LaunchDarkly, Split, Flipt, etc.
  - In practice: `InMemoryProvider` with hardcoded config
- **Consumer** = React component that reads a flag and changes behavior
  - Uses hooks: `useBooleanFlagValue`, `useStringFlagValue`, etc.
  - Never decides the flag logic — just reacts to the value

**Rule**: UI reads flags, provider owns flag logic. Never scatter `if (role === 'admin')` in components.

---

### Flag Types

| Type | Hook | Use case |
|------|------|----------|
| Boolean | `useBooleanFlagValue('flag', false)` | Show/hide, enable/disable |
| String | `useStringFlagValue('flag', 'default')` | A/B variants, layout switching |
| Number | `useNumberFlagValue('flag', 10)` | Thresholds, limits |
| Object | `useObjectFlagValue('flag', {})` | Complex config blobs |

---

### Default Values

Every flag read needs a **default** — the fallback when the provider is down or the flag doesn't exist.

```tsx
const show = useBooleanFlagValue('showBanner', false)
//                                          ^^^^^ THIS MATTERS
```

**How to pick defaults**: Choose whatever is safest if things break.

| Scenario | Safe default | Why |
|----------|-------------|-----|
| Show discount pricing | `false` | Prevents revenue loss if provider crashes |
| Show experimental UI | `false` | Don't break users if flag is missing |
| Enable risky API path | `false` | Fall back to stable path |
| Throttle requests | `true` | Keep rate limiting if unsure |

---

### Evaluation Context (Targeting)

Context = "who is asking?" — lets the provider return different values per user.

```tsx
// Set context (provider level)
OpenFeature.setContext({
  targetingKey: 'user-123',
  role: 'admin',
  environment: 'production',
})
```

```ts
// Use context in flag evaluation
contextEvaluator: (ctx) => {
  return ctx.role === 'admin' ? 'on' : 'off'
}
```

When context changes, OpenFeature **re-evaluates all flags automatically**. No manual refetch.

---

### The Hook Spectrum

```tsx
// Simple — just the value
const v = useBooleanFlagValue('flag', false)

// Detailed — value + metadata
const { value, variant, reason, flagMetadata } = useBooleanFlagDetails('flag', false)
```

**Reason** tells you why the flag got that value:

| Reason | Meaning |
|--------|---------|
| `STATIC` | Hardcoded default from config |
| `TARGETING_MATCH` | A contextEvaluator rule matched |
| `DEFAULT` | Flag not found, used fallback |
| `ERROR` | Something went wrong |

---

## Architecture Pattern

```
main.tsx
  ├─ initFlags()              ← register provider (once, before render)
  └─ <OpenFeatureProvider>    ← React context binding
       └─ <App>
            └─ Component
                 └─ useBooleanFlagValue()  ← reads flag, re-renders on change
```

**Key layers**:

```
flagKeys.ts          →  Flag names (single source of truth, prevents typos)
createFlagsProvider  →  Flag values + rules (the "config")
evaluationContext    →  Who is asking? (user role, environment)
Components           →  What to render? (consume flag, decide UI)
```

---

## Build Order (repeat until automatic)

1. **Name the flag** in `flagKeys.ts`
2. **Configure the flag** in the provider (variants + default)
3. **Read the flag** in the component with the right hook
4. **Branch behavior** based on the value (not just text)
5. **Add context** if you need role/environment targeting

---

## Mental Models

### Flags control behavior, not decoration

❌ Bad: flag changes button text
✅ Good: flag switches between list and card layout, hides a feature, changes pricing

### Safest default wins

Ask: "What happens if the provider is completely down?"
The answer is your default value.

### Flags are temporary or long-lived

- **Temporary**: A/B tests, rollouts → delete after experiment
- **Long-lived**: Kill switches, entitlements → keep forever
- Know which kind you're creating

---

## Repetition Drill

1. Define the product behavior
2. Name the flag clearly
3. Decide the default value (safest option)
4. Evaluate the flag close to where behavior changes
5. Keep provider logic outside UI components

Repeat until < 5 minutes from scratch.
