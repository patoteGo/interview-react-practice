export type CartLine = {
	id: string
	name: string
	price: number
	quentity: number
}

export type Discount = 
| { type: 'fixed'; amount: number }
| { type: 'percentage'; amount: number }


