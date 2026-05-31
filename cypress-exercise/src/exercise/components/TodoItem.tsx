import type { Todo } from "../api/todosApi";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string, done: boolean) => Promise<void>;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
	return (
		<li data-testid={`todo-item-${todo.id}`}>
			<label>
				<input
					data-testid={`todo-toggle-${todo.id}`}
					type="checkbox"
					checked={todo.done}
					onChange={() => onToggle(todo.id, !todo.done)}
				/>
				<span
					data-testid={`todo-title-${todo.id}`}
					style={{
						textDecoration: todo.done ? "line-through" : "none",
						opacity: todo.done ? 0.6 : 1,
					}}
				>
					{todo.title}
				</span>
			</label>
		</li>
	);
}
