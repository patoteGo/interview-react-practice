import { useState } from "react";

interface TodoFormProps {
	onSubmit: (title: string) => Promise<void>;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
	const [title, setTitle] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed || submitting) return;
		setSubmitting(true);
		try {
			await onSubmit(trimmed);
			setTitle("");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form data-testid="todo-form" onSubmit={handleSubmit}>
			<input
				data-testid="todo-input"
				type="text"
				placeholder="What needs to be done?"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				disabled={submitting}
			/>
			<button
				data-testid="todo-submit-button"
				type="submit"
				disabled={submitting}
			>
				{submitting ? "Adding…" : "Add"}
			</button>
		</form>
	);
}
