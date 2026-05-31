export type CartLine = {
	id: string
	name: string
	price: number
	quantity: number
}

export type Discount = 
| { type: 'fixed'; amount: number }
| { type: 'percentage'; amount: number }


