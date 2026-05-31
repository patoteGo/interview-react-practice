import type { Cartline } from './../cart/types'

export type CheckoutInput = {
	email: string 
	fullName: string
	address: string
	lines: CartLine[]
}

export type ValidationResult = {
	isValid: boolean
	errors: string[]
}

