const API_URL = "http://localhost:4001/api/todos";

export interface Todo {
	id: string;
	title: string;
	done: boolean;
}

export async function fetchTodos(): Promise<Todo[]> {
	const res = await fetch(API_URL);
	if (!res.ok) throw new Error("Failed to load todos");
	return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});
	if (!res.ok) throw new Error("Failed to create todo");
	return res.json();
}

export async function toggleTodo(id: string, done: boolean): Promise<Todo> {
	const res = await fetch(`${API_URL}/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ done }),
	});
	if (!res.ok) throw new Error("Failed to update todo");
	return res.json();
}

/** Reset server to seed data — use in Cypress beforeEach */
export async function resetTodos(): Promise<void> {
	await fetch(API_URL, { method: "DELETE" });
}
