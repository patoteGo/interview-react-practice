import type { CartLine } from './types'

export function calculateCartTotal(lines: CartLine[]): number {
	// TODO: implement
	return lines.reduce((total, line) => {	return total + line.price * line.quantity
}, 0)
}

