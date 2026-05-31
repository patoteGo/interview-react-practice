import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct } from '../api/productsApi'

// ─── useCreateProductMutation ───────────────────────────────
//
// TODO: Create a mutation hook for adding a new product.
//
// Hints:
//   import { useMutation, useQueryClient } from '@tanstack/react-query'
//   import { createProduct } from '../api/productsApi'
//
//   export function useCreateProductMutation() {
//     const queryClient = useQueryClient()
//
//     return useMutation({
//       mutationFn: createProduct,
//       onSuccess: () => {
//         // Invalidate the products query so it refetches
//         queryClient.invalidateQueries({ queryKey: ['products'] })
//       },
//     })
//   }
//
// The hook returns { mutate, mutateAsync, isPending, isError, error, ... }

export function useCreateProductMutation() {
	// Implementation here
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
		},
	})
}