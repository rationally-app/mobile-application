import { useEffect, useState, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppState = (): AppStateStatus => {
  const [appState, setAppState] = useState(AppState.currentState);
  const prevAppState = useRef<AppStateStatus>("inactive");

  const onChange = (newState: AppStateStatus): void => {
    setAppState(appState => {
      prevAppState.current = appState;
      return newState;
    });
  };

  useEffect(() => {
    AppState.addEventListener("change", onChange);
    return () => {
      AppState.removeEventListener("change", onChange);
    };
  }, []);

  return appState;
};
