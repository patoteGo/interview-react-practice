# Virtualised Table Implementation Guide

## What is already done for you
- React + Vite + TypeScript scaffold
- starter page and styling
- exercise folders for data, math, and components

## Read these in order
1. `INSTRUCTIONS.md` — concept map
2. `IMPLEMENTATION-GUIDE.md` — concrete assignment
3. `GUIDED-EXAMPLES.md` — code-shaped hints
4. `PRACTICE-CHECKLIST.md` — repetition tracker
5. `MILESTONES.md` — progress ladder

## Your assignment
Build a large table that stays fast by rendering only the visible rows.

Suggested files to create:
- `src/exercise/data/makeRows.ts`
- `src/exercise/math/getVisibleRange.ts`
- `src/exercise/math/getOffsetTop.ts`
- `src/exercise/components/VirtualTable.tsx`
- optional: `src/exercise/components/Row.tsx`

## Suggested data model
Each row can look like:
- `id`
- `name`
- `status`
- `amount`

## Recommended order
1. Generate a large dataset
2. Render a plain table first
3. Add a fixed-height scroll container
4. Compute visible start and end indexes
5. Render only the slice
6. Preserve total height with spacer math
7. Add overscan
8. Add sticky header or sorting only after scroll is stable

## Real learning targets
- understand why too many DOM nodes are slow
- understand viewport vs total list
- understand overscan
- separate math from row rendering
- learn to check behavior visually, not just logically
