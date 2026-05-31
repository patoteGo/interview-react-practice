import http from "node:http";

const SEED = [
	{ id: "1", title: "Read the guide", done: true },
	{ id: "2", title: "Build the UI flow", done: false },
	{ id: "3", title: "Write Cypress tests", done: false },
];

let todos = structuredClone(SEED);

const json = (res, status, data) => {
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	});
	res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
	if (!req.url) return json(res, 404, { message: "Not found" });
	if (req.method === "OPTIONS") return json(res, 200, {});

	if (req.url === "/health" && req.method === "GET") {
		return json(res, 200, { ok: true });
	}

	if (req.url === "/api/todos" && req.method === "GET") {
		return setTimeout(() => json(res, 200, todos), 250);
	}

	if (req.url === "/api/todos" && req.method === "DELETE") {
		todos = structuredClone(SEED);
		return json(res, 200, { reset: true });
	}

	if (req.url === "/api/todos" && req.method === "POST") {
		let body = "";
		for await (const chunk of req) body += chunk;
		const payload = JSON.parse(body || "{}");
		const todo = {
			id: String(Date.now()),
			title: payload.title ?? "",
			done: false,
		};
		todos = [...todos, todo];
		return json(res, 201, todo);
	}

	if (req.url.startsWith("/api/todos/") && req.method === "PATCH") {
		const id = req.url.split("/").pop();
		let body = "";
		for await (const chunk of req) body += chunk;
		const payload = JSON.parse(body || "{}");
		todos = todos.map((todo) =>
			todo.id === id ? { ...todo, ...payload } : todo,
		);
		const todo = todos.find((item) => item.id === id);
		return json(res, 200, todo ?? { message: "Not found" });
	}

	return json(res, 404, { message: "Not found" });
});

server.listen(4001, () => {
	console.log("Cypress exercise API on http://localhost:4001");
});
