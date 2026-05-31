// ─────────────────────────────────────────────────────────────
// Step 3 (Level 3): Evaluation context
//
// Evaluation context is the data OpenFeature uses to decide
// WHICH variant a user gets. Think of it as "who is asking?"
//
// Common context fields:
//   - userId, role, email
//   - environment (production, staging)
//   - device, region, etc.
//
// In a real app this comes from auth state, URL params, etc.
// For the exercise we use a simple React context + provider.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, type ReactNode } from "react";
import { OpenFeature, type EvaluationContext } from "@openfeature/react-sdk";

/**
 * Shape of the user/context data our app cares about.
 */
export interface AppContext {
	userId: string;
	role: "admin" | "user" | "guest";
	environment: "development" | "staging" | "production";
}

/**
 * Default context — what you get before login / identification.
 * SAFEST defaults: guest, production constraints.
 */
const defaultAppContext: AppContext = {
	userId: "anonymous",
	role: "guest",
	environment: "development",
};

// ─────────────────────────────────────────────────────────
// TODO: Uncomment everything below when you reach Level 3
// ─────────────────────────────────────────────────────────

/*
const AppContextReact = createContext<{
  ctx: AppContext;
  setCtx: (ctx: AppContext) => void;
}>({
  ctx: defaultAppContext,
  setCtx: () => {},
});

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<AppContext>(defaultAppContext);

  //
  // KEY CONCEPT: When evaluation context changes, OpenFeature
  // re-evaluates all flags automatically. This is how you get
  // role-based, user-specific flag values without manual refetch.
  //
  function updateContext(newCtx: AppContext) {
    setCtx(newCtx);
    OpenFeature.setContext(mapToOpenFeatureContext(newCtx));
  }

  return (
    <AppContextReact.Provider value={{ ctx, setCtx: updateContext }}>
      {children}
    </AppContextReact.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContextReact);
}

function mapToOpenFeatureContext(app: AppContext): EvaluationContext {
  return {
    targetingKey: app.userId,
    role: app.role,
    environment: app.environment,
  };
}
*/
