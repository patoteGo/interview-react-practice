# TanStack Query Implementation Guide

## What is already done for you
- React + Vite + TypeScript scaffold
- TanStack Query dependency installed
- sample API server at `http://localhost:4002`

## Read these in order
1. `INSTRUCTIONS.md`
2. `IMPLEMENTATION-GUIDE.md`
3. `GUIDED-EXAMPLES.md`
4. `PRACTICE-CHECKLIST.md`
5. `MILESTONES.md`

## Your assignment
Build a products page that fetches server data with TanStack Query.

Suggested files to create:
- `src/exercise/api/productsApi.ts`
- `src/exercise/queries/queryClient.ts`
- `src/exercise/queries/useProductsQuery.ts`
- `src/exercise/mutations/useCreateProductMutation.ts`
- `src/exercise/components/ProductsPage.tsx`

## Sample backend routes
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`

## Recommended order
1. Create QueryClient
2. Wrap the app with provider
3. Fetch product list
4. Render loading/error/success states
5. Add one create or update mutation
6. Invalidate the list query
7. Optionally add filters to the query key
