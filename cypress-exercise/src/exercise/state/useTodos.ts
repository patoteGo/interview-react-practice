import { useCallback, useEffect, useState } from "react";
import { type Todo, fetchTodos, createTodo, toggleTodo } from "../api/todosApi";

interface UseTodosReturn {
	todos: Todo[];
	loading: boolean;
	error: string | null;
	addTodo: (title: string) => Promise<void>;
	toggle: (id: string, done: boolean) => Promise<void>;
	retry: () => void;
}

export function useTodos(): UseTodosReturn {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchTodos();
			setTodos(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const addTodo = useCallback(async (title: string) => {
		const todo = await createTodo(title);
		setTodos((prev) => [...prev, todo]);
	}, []);

	const toggle = useCallback(async (id: string, done: boolean) => {
		const updated = await toggleTodo(id, done);
		setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
	}, []);

	return { todos, loading, error, addTodo, toggle, retry: load };
}
