# OpenFeature Guided Examples

## Provider setup shape
```ts
import { OpenFeature, OpenFeatureProvider, InMemoryProvider } from '@openfeature/react-sdk'

const flags = {
  showPoints: {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: 'off',
  },
} as const

OpenFeature.setProvider(new InMemoryProvider(flags))
```

## Boolean flag usage
```tsx
import { useBooleanFlagValue } from '@openfeature/react-sdk'

function ScoreColumn() {
  const showPoints = useBooleanFlagValue('showPoints', false)
  return showPoints ? <span>120 points</span> : null
}
```

## Questions to answer before coding
- what is the safest default?
- should this change behavior or only appearance?
- where does user context belong?
