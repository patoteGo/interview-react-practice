import type { CartLine } from './types'

export function calculateLineTotal(line: Cartline): number {

	const total = line.price * line.quantity
	if (line.quantity < 0) {
		throw new Error('Quantity cannot be negative')
	}
	return total
}

