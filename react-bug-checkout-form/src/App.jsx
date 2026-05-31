import { useMemo, useState } from "react";

const initialItems = [
	{ id: "sku-filter", name: "Paper Filters", price: 6, quantity: 5 },
	{ id: "sku-mug", name: "Travel Mug", price: 22, quantity: 1 },
];

function LineItem({ item, onRemove, onQuantityChange }) {
	const [draftQuantity, setDraftQuantity] = useState(item.quantity);

	const lineTotal = useMemo(
		() => item.price * draftQuantity,
		[item.price, draftQuantity],
	);

	return (
		<div className="line-item">
			<div>
				<strong>{item.name}</strong>
				<p>${item.price} each</p>
			</div>

			<label>
				Qty
				<input
					type="number"
					min="1"
					value={draftQuantity}
					onChange={(event) => {
						const nextQuantity = Number(event.target.value);
						setDraftQuantity(nextQuantity);
						onQuantityChange(item.id, nextQuantity);
					}}
				/>
			</label>

			<div className="line-total">${lineTotal}</div>

			<button onClick={() => onRemove(item.id)}>Remove</button>
		</div>
	);
}

export default function App() {
	const [items, setItems] = useState(initialItems);

	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	function updateQuantity(itemId, nextQuantity) {
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === itemId
					? {
							...item,
							quantity: Number.isFinite(nextQuantity)
								? Math.max(1, nextQuantity)
								: 1,
						}
					: item,
			),
		);
	}

	function removeItem(itemId) {
		setItems((currentItems) =>
			currentItems.filter((item) => item.id !== itemId),
		);
	}

	return (
		<main className="page">
			<div className="card">
				<span className="eyebrow">React bug practice</span>
				<h1>Checkout line items</h1>
				<p className="intro">
					Reproduce the bug by changing quantities, then removing the first or
					second row. Some quantities and totals jump to the wrong product.
				</p>

				<div className="stack">
					{items.map((item) => (
						<LineItem
							key={item.id}
							item={item}
							onRemove={removeItem}
							onQuantityChange={updateQuantity}
						/>
					))}
				</div>

				<div className="summary">
					<span>Subtotal</span>
					<strong>${subtotal}</strong>
				</div>
			</div>
		</main>
	);
}
