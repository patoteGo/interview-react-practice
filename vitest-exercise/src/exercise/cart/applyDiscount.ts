import { Discount } from './types'

export function applyDiscount(subTotal: number, discount?: Discount): number {
	if(discount?.type === 'percentage') {
		return Math.max(0, subTotal - (subTotal * (discount.amount / 100)))
	}
		if (discount?.type === 'fixed') {
		return Math.max(0, subTotal - discount.amount)
	}
	
	return subTotal
}

