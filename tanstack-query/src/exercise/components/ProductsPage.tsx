import { useState } from "react";
// TODO: import your custom hooks here
import { useProductsQuery } from '../queries/useProductsQuery'
import { useCreateProductMutation } from '../mutations/useCreateProductMutation'
import { useToggleStockMutation } from '../mutations/useToggleStockMutation'

export function ProductsPage() {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");

	// TODO: call your hooks here
	const { data: products, isLoading, isError, error, refetch } = useProductsQuery()
	const createMutation = useCreateProductMutation()
	const toggleMutation = useToggleStockMutation()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: call createMutation.mutate({ name, price: Number(price) })
		// then clear the form: setName(''), setPrice('')
		createMutation.mutate({ name, price: Number(price) })
		setName('')
		setPrice('')
	};

	// TODO: Replace this placeholder with real loading/error/success rendering
	// using the data from useProductsQuery.
	//
	// Pattern:
	//   if (isLoading) return <div>Loading...</div>
	//   if (isError)   return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (isError) return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>
	//   // render products list from `products`

	return (
		<div className="page">
			<h1>Products</h1>

			{/* ── Add product form ── */}
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
			>
				<input
					placeholder="Product name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{
						padding: "0.5rem",
						borderRadius: 8,
						border: "1px solid #334155",
						background: "#1e293b",
						color: "#e2e8f0",
					}}
				/>
				<input
					placeholder="Price"
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					style={{
						padding: "0.5rem",
						borderRadius: 8,
						border: "1px solid #334155",
						background: "#1e293b",
						color: "#e2e8f0",
						width: 100,
					}}
				/>
				<button
					type="submit"
					style={{
						padding: "0.5rem 1rem",
						borderRadius: 8,
						border: "none",
						background: "#2563eb",
						color: "#fff",
						cursor: "pointer",
					}}
				>
					Add
				</button>
			</form>

			{/* TODO: replace this with the real products list */}
			<p className="muted">
				Implement useProductsQuery above, then render the products here.
			</p>

			{/* ── Product list (uncomment and complete) ── */}
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {products?.map((product) => (
          <li key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{product.name}</strong>
              <span className="muted"> — ${product.price}</span>
            </div>
            <button
              onClick={() => toggleMutation.mutate({ id: product.id, inStock: !product.inStock })}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: 'none',
                background: product.inStock ? '#16a34a' : '#dc2626',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </button>
          </li>
        ))}
      </ul>
     
		</div>
	);
}
