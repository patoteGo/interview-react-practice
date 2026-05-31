import { describe, expect, it } from 'vitest'
import { applyDiscount } from './applyDiscount'
import { fetchOrderSummary } from './fetchOrderSummary'

describe('fetchOrderSummary', () => {
	it('returns parsd son son success', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ orderId: '123', total: 100 }),
		} as Response)

		const result = await fetchOrderSummary('123')
		expect(result).toEqual({ orderId: '123', total: 100 })
	})

	it('throws an error on failed fetch', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValue({
			ok: false,
		} as Response)

		await expect(fetchOrderSummary('123')).rejects.toThrow('Failed to fetch order summary')
	}


)


})