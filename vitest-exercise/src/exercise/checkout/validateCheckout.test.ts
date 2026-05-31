import { describe, expect, it } from 'vitest'
import { validateCheckout } from './validateCheckout'

const validInput = {
	email: 'pat@example.com',
	fullName: 'Pat',
	address: '123 Main St',
	lines: [
		{ id: '1', name: 'Keyboard', price: 50, quantity: 2 },
		{ id: '2', name: 'Mouse', price: 25, quantity: 1 },
	]
}

describe('validateCheckout', () => {
	it('return valid for a correct payload', () => {
		expect(validateCheckout(validInput)).toEqual({
			isValid: true,
			errors: []
		})
	})

	it('return an error when email is missing', () => {
		const input = { ...validInput, email: '' }
		expect(validateCheckout(input)).toEqual({
			isValid: false,
			errors: ['Email is required']
		})
	})

	it('return an error when full name is missing', () => {
		const input = { ...validInput, fullName: ' ' }
		expect(validateCheckout(input)).toEqual({
			isValid: false,
			errors: ['Full name is required']
		})
	})

	it('return an error when address is missing', () => {
		const input = { ...validInput, address: ' ' }
		expect(validateCheckout(input)).toEqual({
			isValid: false,
			errors: ['Address is required']
		})
	})

	it('return an error when no product lines are provided', () => {
		const input = { ...validInput, lines: [] }
		expect(validateCheckout(input)).toEqual({
			isValid: false,
			errors: ['At least one product line is required']
		})
	})

	it('return multiple errors when multiple fields are invalid', () => {
		const input = { ...validInput, email: '', fullName: ' ', address: ' ', lines: [] }
		expect(validateCheckout(input)).toEqual({
			isValid: false,
			errors: [
				'Email is required',
				'Full name is required',
				'Address is required',
				'At least one product line is required'
			]
		})
	})

})