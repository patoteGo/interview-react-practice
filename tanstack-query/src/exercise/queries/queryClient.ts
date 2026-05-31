import { QueryClient } from '@tanstack/react-query'
// ─── QueryClient setup ──────────────────────────────────────
//
// TODO: Create and export a QueryClient instance.
//
// Hints:
//   import { QueryClient } from '@tanstack/react-query'
//   export const queryClient = new QueryClient()
//
// Optional: pass defaultOptions to configure staleTime, retry, etc.
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: true,
		},

	},
})

