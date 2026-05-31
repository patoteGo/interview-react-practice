# OpenFeature Implementation Guide

## What is already done for you
- React + Vite + TypeScript scaffold
- OpenFeature React SDK installed
- starter folders for provider, flags, and components

## Read these in order
1. `INSTRUCTIONS.md`
2. `IMPLEMENTATION-GUIDE.md`
3. `GUIDED-EXAMPLES.md`
4. `PRACTICE-CHECKLIST.md`
5. `MILESTONES.md`

## Your assignment
Build a feature-flagged page with 2-3 real behavior switches.

Suggested files to create:
- `src/exercise/provider/createFlagsProvider.ts`
- `src/exercise/flags/flagKeys.ts`
- `src/exercise/components/NewsFeed.tsx`
- `src/exercise/components/PricingCard.tsx`
- `src/exercise/components/BetaSearch.tsx`

## Good starter flags
- `showPoints`
- `useNewCheckout`
- `pricingVariant`

## Recommended order
1. Define flag keys
2. Create local in-memory provider
3. Wrap app with `OpenFeatureProvider`
4. Read one boolean flag in UI
5. Add string or variant flag
6. Add context-aware behavior
7. Add safe defaults and explain them
