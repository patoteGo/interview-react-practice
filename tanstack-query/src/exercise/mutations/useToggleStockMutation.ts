// ─── useToggleStockMutation ────────────────────────────────
//
// TODO: Create a mutation hook for toggling a product's inStock status.
//
// Hints:
//   import { useMutation, useQueryClient } from '@tanstack/react-query'
//   import { toggleStock } from '../api/productsApi'
//
//   export function useToggleStockMutation() {
//     const queryClient = useQueryClient()
//
//     return useMutation({
//       mutationFn: ({ id, inStock }: { id: string; inStock: boolean }) =>
//         toggleStock(id, inStock),
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ['products'] })
//       },
//     })
//   }

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleStock } from '../api/productsApi'

export function useToggleStockMutation() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, inStock }: { id: string; inStock: boolean }) =>
			toggleStock(id, inStock),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
		},
	})
}
