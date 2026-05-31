// TODO: Wire up the QueryClientProvider here.
//
// Hints:
//   import { QueryClientProvider } from '@tanstack/react-query'
//   import { queryClient } from './exercise/queries/queryClient'
//
//   Wrap <App /> with:
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './exercise/queries/queryClient'
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>,
);
