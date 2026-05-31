import { describe, expect, it } from 'vitest'
import { applyDiscount } from './applyDiscount'


describe('applyDiscount', () => {
	it('return the original subtotal if no discount is provided', () => {
		const subTotal = 100;
		const result = applyDiscount(subTotal)
		expect(result).toBe(subTotal)
	})

	it('applies a percentage discount', () => {
		const subTotal = 200;
		const discount = { type: 'percentage', amount: 25 }
		const result = applyDiscount(subTotal, discount)
		expect(result).toBe(150)
	})

	it('applies a fixed discount', () => {
		const subTotal = 100;
		const discount = { type: 'fixed', amount: 20 }
		const result = applyDiscount(subTotal, discount)
		expect(result).toBe(80)
	})

	it('does not allow the total to go below 0', () => {
		const subTotal = 50;
		const discount = { type: 'fixed', amount: 100 }
		const result = applyDiscount(subTotal, discount)
		expect(result).toBe(0)
	})

	it('does not allow the total to go below 0 on percentage discounts', () => {
		const subTotal = 50;
		const discount = { type: 'percentage', amount: 200 }
		const result = applyDiscount(subTotal, discount)
		expect(result).toBe(0)
	})
})