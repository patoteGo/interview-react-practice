import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// TODO (Step 2): Import and call init BEFORE rendering the tree
// import { initFlags } from './exercise/provider/createFlagsProvider'
// initFlags();

// TODO (Step 3 / Level 3): Import AppContextProvider
// import { AppContextProvider } from './exercise/evaluationContext'

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{/*
      TODO (Step 2): Wrap with OpenFeatureProvider AFTER calling initFlags()
      
      import { OpenFeatureProvider } from '@openfeature/react-sdk'
      
      <OpenFeatureProvider>
        <App />
      </OpenFeatureProvider>
    */}
		<App />
	</React.StrictMode>,
);
