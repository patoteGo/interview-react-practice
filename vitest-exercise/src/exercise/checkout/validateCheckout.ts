import type { CheckoutInput, ValidationResult } from './types'

export function validateCheckout(input: CheckoutInput): ValidationResult {
	const errors: string[] = []

	// TODO: add rules
	if(!input.email.includes('@')) {
		errors.push('Email is required')
	}

	if(input.fullName.trim() === '') {
		
		errors.push('Full name is required')
	}

	if(input.address.trim() === '') {
		errors.push('Address is required')
	}

	if(input.lines.length === 0) {
		errors.push('At least one product line is required')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}