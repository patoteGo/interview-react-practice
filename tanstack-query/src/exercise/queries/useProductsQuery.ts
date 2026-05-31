import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/productsApi'
// ─── useProductsQuery ───────────────────────────────────────
//
// TODO: Create a custom hook that uses useQuery to fetch the products list.
//
// Hints:
//   import { useQuery } from '@tanstack/react-query'
//   import { fetchProducts } from '../api/productsApi'
//
//   export function useProductsQuery() {
//     return useQuery({
//       queryKey: ['products'],   // stable key for this cache entry
//       queryFn: fetchProducts,   // the function that actually fetches
//     })
//   }
//
// The hook returns { data, isLoading, isError, error, refetch, ... }

export function useProductsQuery() {
	return useQuery({
		queryKey: ['products'],
		queryFn: fetchProducts,
	})
}