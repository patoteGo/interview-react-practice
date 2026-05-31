# Virtualised Table Guided Examples

## Start with the type of problem
You have:
- a lot of rows in memory
- a scroll container with fixed height
- a row height
- a scroll offset

You need:
- start index
- end index
- top spacer or translate offset

## Example row generator shape
```ts
export type TableRow = {
  id: string
  name: string
  status: 'active' | 'paused'
  amount: number
}

export function makeRows(count: number): TableRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Row ${index + 1}`,
    status: index % 2 === 0 ? 'active' : 'paused',
    amount: (index + 1) * 10,
  }))
}
```

## Example visible-range function shape
```ts
export function getVisibleRange(args: {
  scrollTop: number
  rowHeight: number
  containerHeight: number
  rowCount: number
  overscan?: number
}) {
  // TODO: compute start and end indexes
  return { startIndex: 0, endIndex: 0 }
}
```

## First mental formula
```text
startIndex = floor(scrollTop / rowHeight)
visibleCount = ceil(containerHeight / rowHeight)
endIndex = startIndex + visibleCount - 1
```

Then add overscan.

## Component skeleton
```tsx
export function VirtualTable() {
  // rows
  // scrollTop state
  // range calculation
  // visible rows slice
  // spacer height or translated wrapper
  return <div>TODO</div>
}
```

## What to test mentally
- scrollTop = 0
- middle of list
- near end of list
- very small dataset
- overscan bigger than needed
