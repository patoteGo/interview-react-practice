import { describe, expect, it } from 'vitest'
import { calculateLineTotal } from './calculateLineTotal'


describe('calculateLineTotal', () => {
	it('multiplies price by quantity', () => {
		const line = {
			id: '1',
			name: 'Keyboard',
			price: 50,
			quantity: 2
		}

		const result = calculateLineTotal(line)
		expect(result).toBe(100)
	})

	it('returns 0 if quantity is 0', () => {
		const line = {
			id: '2',
			name: 'Mouse',
			price: 30,
			quantity: 0
		}

		const result = calculateLineTotal(line)
		expect(result).toBe(0)
	})
	it('throws when quantity is negative', () => {
  const line = {
    id: '1',
    name: 'Keyboard',
    price: 50,
    quantity: -1,
  }

  expect(() => calculateLineTotal(line)).toThrow()
})

})
