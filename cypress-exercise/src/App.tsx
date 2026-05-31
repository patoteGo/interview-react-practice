import { TodoForm } from "./exercise/components/TodoForm";
import { TodoList } from "./exercise/components/TodoList";
import { useTodos } from "./exercise/state/useTodos";

export default function App() {
	const { todos, loading, error, addTodo, toggle, retry } = useTodos();

	return (
		<main className="page">
			<section className="hero">
				<p className="eyebrow">Cypress practice</p>
				<h1 data-testid="page-heading">Todos</h1>
			</section>

			<section className="card">
				<TodoForm onSubmit={addTodo} />
				<TodoList
					todos={todos}
					loading={loading}
					error={error}
					onToggle={toggle}
					onRetry={retry}
				/>
			</section>
		</main>
	);
}
