export async function fetchOrderSummary(orderId: string) {
	const response = await fetch(`/api/orders/${orderId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch order summary')
	}
	return response.json()
}