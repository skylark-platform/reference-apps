import React, { createContext, useContext, useReducer } from "react";
import { LoadingScreen } from "../loading-screen";

interface ContextProps {
  showLoadingScreen: boolean;
  setAppLoaded: (loaded: boolean) => void;
}

interface State {
  // initialTitleScreenAnimationComplete helps us identify when the title screen animation has finished
  // whereas initialLoadComplete helps us identify the first time the loading screen was hidden
  initialTitleScreenAnimationComplete: boolean;
  initialLoadComplete: boolean;
  appLoaded: boolean;
}

type Action = {
  type:
    | "initialTitleScreenAnimationComplete"
    | "initialLoadComplete"
    | "appLoaded";
  value: boolean;
};

const AppLoadedContext = createContext<ContextProps>({} as ContextProps);

function appLoadedReducer(state: State, action: Action): State {
  switch (action.type) {
    case "initialTitleScreenAnimationComplete": {
      return { ...state, initialTitleScreenAnimationComplete: action.value };
    }
    case "initialLoadComplete": {
      return { ...state, initialLoadComplete: action.value };
    }
    case "appLoaded": {
      return { ...state, appLoaded: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type as string}`);
    }
  }
}

export const AppLoadedProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appLoadedReducer, {
    appLoaded: true,
    initialTitleScreenAnimationComplete: false,
    initialLoadComplete: false,
  });
  const setAppLoaded = (loaded: boolean) =>
    dispatch({ type: "appLoaded", value: loaded });
  const showLoadingScreen =
    !state.appLoaded || !state.initialTitleScreenAnimationComplete;
  const value = { showLoadingScreen, setAppLoaded };
  return (
    <AppLoadedContext.Provider value={value}>
      {
        <LoadingScreen
          show={showLoadingScreen}
          // Only show the titles on the initial load of the app
          withTitle={!state.initialLoadComplete}
          onAnimationComplete={() =>
            dispatch({
              type: "initialTitleScreenAnimationComplete",
              value: true,
            })
          }
          onExitComplete={() =>
            dispatch({ type: "initialLoadComplete", value: true })
          }
        />
      }
      {children}
    </AppLoadedContext.Provider>
  );
};

export const useAppLoaded = () => {
  const context = useContext(AppLoadedContext);
  if (context === undefined) {
    throw new Error("useAppLoaded must be used within a AppLoadedProvider");
  }
  return context;
};
