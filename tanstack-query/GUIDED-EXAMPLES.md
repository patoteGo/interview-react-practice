# TanStack Query Guided Examples

## QueryClient shape
```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

## Query hook shape
```ts
import { useQuery } from '@tanstack/react-query'

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4002/api/products')
      if (!response.ok) throw new Error('Failed to load products')
      return response.json()
    },
  })
}
```

## Mutation shape
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { name: string; price: number }) => {
      const response = await fetch('http://localhost:4002/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```
