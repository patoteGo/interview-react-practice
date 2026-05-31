import { describe,expect, it} from 'vitest'
import { calculateCartTotal } from './calculateCartTotal'

describe('calculateCartTotal', () => {
	it('return 0 for a empty cart', () => {
		const lines: CartLine[] = []
		const result = calculateCartTotal(lines)
		expect(result).toBe(0)
	})

	it('sums multiple cart lines', () => {
		 const lines: CartLine[] = [
      { id: '1', name: 'Keyboard', price: 50, quantity: 2 },
      { id: '2', name: 'Mouse', price: 25, quantity: 1 },
    ]

		expect(calculateCartTotal(lines)).toBe(125)
	})
})