import type { Todo } from "../api/todosApi";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
	todos: Todo[];
	loading: boolean;
	error: string | null;
	onToggle: (id: string, done: boolean) => Promise<void>;
	onRetry: () => void;
}

export function TodoList({
	todos,
	loading,
	error,
	onToggle,
	onRetry,
}: TodoListProps) {
	if (loading) {
		return <p data-testid="todo-loading">Loading todos…</p>;
	}

	if (error) {
		return (
			<div data-testid="todo-error">
				<p>{error}</p>
				<button data-testid="todo-retry-button" onClick={onRetry}>
					Retry
				</button>
			</div>
		);
	}

	if (todos.length === 0) {
		return <p data-testid="todo-empty">No todos yet. Add one above!</p>;
	}

	return (
		<ul data-testid="todo-list">
			{todos.map((todo) => (
				<TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
			))}
		</ul>
	);
}
