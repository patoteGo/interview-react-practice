// ─── API layer ──────────────────────────────────────────────
// These are plain fetch functions — no TanStack Query here.
// TanStack Query will CALL these from queryFn / mutationFn.

export interface Product {
	id: string;
	name: string;
	price: number;
	inStock: boolean;
}

const API = "http://localhost:4002";

export async function fetchProducts(): Promise<Product[]> {
	const res = await fetch(`${API}/api/products`);
	if (!res.ok) throw new Error("Failed to fetch products");
	return res.json();
}

export async function createProduct(input: {
	name: string;
	price: number;
	inStock?: boolean;
}): Promise<Product> {
	const res = await fetch(`${API}/api/products`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) throw new Error("Failed to create product");
	return res.json();
}

export async function toggleStock(
	id: string,
	inStock: boolean,
): Promise<Product> {
	const res = await fetch(`${API}/api/products/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ inStock }),
	});
	if (!res.ok) throw new Error("Failed to update product");
	return res.json();
}
